import { useState, useCallback } from 'preact/hooks'
import type { StandingsRow } from './types'
import { parseStandingsImage } from './api'
import { ApiKeyModal, getApiKey } from './components/ApiKeyModal'
import { ImageUpload } from './components/ImageUpload'
import { StandingsTable } from './components/StandingsTable'

type AppState = 'idle' | 'loading' | 'results'

export function App() {
  const [state, setState] = useState<AppState>('idle')
  const [rows, setRows] = useState<StandingsRow[]>([])
  const [error, setError] = useState('')
  const [showKeyModal, setShowKeyModal] = useState(false)
  const [preview, setPreview] = useState('')

  const hasKey = !!getApiKey()

  const handleImageSelected = useCallback(async (base64: string, mediaType: string) => {
    const apiKey = getApiKey()
    if (!apiKey) {
      setShowKeyModal(true)
      return
    }

    setPreview(`data:${mediaType};base64,${base64}`)
    setState('loading')
    setError('')

    try {
      const parsed = await parseStandingsImage(base64, mediaType, apiKey)
      setRows(parsed)
      setState('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse image')
      setState('idle')
    }
  }, [])

  const handleUpdate = useCallback((index: number, field: keyof StandingsRow, value: string | number) => {
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)))
  }, [])

  const handleDelete = useCallback((index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleReset = () => {
    setState('idle')
    setRows([])
    setPreview('')
    setError('')
  }

  return (
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header class="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 z-10">
        <div class="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <h1 class="text-lg font-bold text-gray-900 dark:text-gray-100">TopCut</h1>
          <button
            onClick={() => setShowKeyModal(true)}
            class={`text-xs px-2.5 py-1 rounded-full border ${
              hasKey
                ? 'border-green-300 dark:border-green-700 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                : 'border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
            }`}
          >
            {hasKey ? 'API Key Set' : 'Set API Key'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main class="max-w-lg mx-auto px-4 py-6 space-y-6">
        {state === 'idle' && (
          <>
            {!hasKey && (
              <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 text-sm text-orange-700 dark:text-orange-400">
                Set your Anthropic API key to get started.
              </div>
            )}
            <ImageUpload onImageSelected={handleImageSelected} disabled={!hasKey} />
          </>
        )}

        {state === 'loading' && (
          <div class="text-center py-12 space-y-4">
            {preview && (
              <img src={preview} alt="Uploaded screenshot" class="max-h-48 mx-auto rounded-lg shadow-md" />
            )}
            <div class="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
              <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span class="text-sm">Parsing standings...</span>
            </div>
          </div>
        )}

        {error && (
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {state === 'results' && (
          <>
            <div class="flex items-center justify-between">
              <h2 class="text-base font-semibold text-gray-900 dark:text-gray-100">
                Standings ({rows.length} players)
              </h2>
              <button
                onClick={handleReset}
                class="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Upload new
              </button>
            </div>

            {preview && (
              <details class="text-sm">
                <summary class="text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
                  Show original image
                </summary>
                <img src={preview} alt="Original screenshot" class="mt-2 max-h-64 mx-auto rounded-lg shadow-md" />
              </details>
            )}

            <StandingsTable rows={rows} onUpdate={handleUpdate} onDelete={handleDelete} />

            <p class="text-xs text-gray-400 dark:text-gray-600 text-center">
              Tap any cell to edit. Changes are not saved automatically.
            </p>
          </>
        )}
      </main>

      <ApiKeyModal
        open={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        onSave={() => {}}
      />
    </div>
  )
}
