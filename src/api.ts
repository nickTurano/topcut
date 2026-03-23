import type { StandingsRow } from './types'

const PROMPT = `Extract the tournament standings from this MTG Companion screenshot.
Return ONLY a JSON array (no markdown, no explanation) with objects containing these fields:
- rank (number)
- name (string)
- points (number)
- record (string, e.g. "3-1-0", or "" if not shown)
- omw_pct (number, the Opponents' Match-Win %, e.g. 66.67)
- pgw_pct (number, the Player Game-Win %, e.g. 75.00)
- ogw_pct (number, the Opponents' Game-Win %, e.g. 55.56)

If a percentage value is not visible, use 0.
Respond with ONLY the JSON array.`

export async function parseStandingsImage(
  imageBase64: string,
  mediaType: string,
  apiKey: string,
): Promise<StandingsRow[]> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: PROMPT,
            },
          ],
        },
      ],
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(
      error?.error?.message || `API error: ${response.status} ${response.statusText}`,
    )
  }

  const data = await response.json()
  const text = data.content?.[0]?.text || ''

  // Extract JSON from the response (handle potential markdown wrapping)
  const jsonMatch = text.match(/\[[\s\S]*\]/)
  if (!jsonMatch) {
    throw new Error('Could not parse standings from the image. Please try again with a clearer screenshot.')
  }

  const rows: StandingsRow[] = JSON.parse(jsonMatch[0])
  return rows
}
