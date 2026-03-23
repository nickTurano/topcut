import type { StandingsRow } from '../types'

interface Props {
  rows: StandingsRow[]
  onUpdate: (index: number, field: keyof StandingsRow, value: string | number) => void
  onDelete: (index: number) => void
}

export function StandingsTable({ rows, onUpdate, onDelete }: Props) {
  if (rows.length === 0) return null

  const handleChange = (index: number, field: keyof StandingsRow, raw: string) => {
    if (field === 'name' || field === 'record') {
      onUpdate(index, field, raw)
    } else {
      const num = parseFloat(raw)
      if (!isNaN(num)) onUpdate(index, field, num)
    }
  }

  return (
    <div class="overflow-x-auto -mx-4 px-4">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-xs uppercase">
            <th class="py-2 px-1 text-left w-8">#</th>
            <th class="py-2 px-1 text-left">Player</th>
            <th class="py-2 px-1 text-center w-12">Pts</th>
            <th class="py-2 px-1 text-center w-16">Record</th>
            <th class="py-2 px-1 text-center w-16">OMW%</th>
            <th class="py-2 px-1 text-center w-16">PGW%</th>
            <th class="py-2 px-1 text-center w-16">OGW%</th>
            <th class="py-2 px-1 w-8"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} class="border-b border-gray-100 dark:border-gray-800">
              <td class="py-1.5 px-1 text-gray-400">{row.rank}</td>
              <td class="py-1.5 px-1">
                <input
                  type="text"
                  value={row.name}
                  onInput={(e) => handleChange(i, 'name', (e.target as HTMLInputElement).value)}
                  class="w-full bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20 rounded px-1 -mx-1"
                />
              </td>
              <Cell value={row.points} field="points" index={i} onChange={handleChange} />
              <td class="py-1.5 px-1 text-center">
                <input
                  type="text"
                  value={row.record}
                  onInput={(e) => handleChange(i, 'record', (e.target as HTMLInputElement).value)}
                  class="w-full bg-transparent text-center text-gray-900 dark:text-gray-100 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20 rounded px-1"
                />
              </td>
              <Cell value={row.omw_pct} field="omw_pct" index={i} onChange={handleChange} />
              <Cell value={row.pgw_pct} field="pgw_pct" index={i} onChange={handleChange} />
              <Cell value={row.ogw_pct} field="ogw_pct" index={i} onChange={handleChange} />
              <td class="py-1.5 px-1">
                <button
                  onClick={() => onDelete(i)}
                  class="text-gray-300 dark:text-gray-700 hover:text-red-500 dark:hover:text-red-400 text-xs"
                  title="Remove row"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Cell({
  value,
  field,
  index,
  onChange,
}: {
  value: number
  field: keyof StandingsRow
  index: number
  onChange: (i: number, f: keyof StandingsRow, v: string) => void
}) {
  return (
    <td class="py-1.5 px-1 text-center">
      <input
        type="number"
        value={value}
        onInput={(e) => onChange(index, field, (e.target as HTMLInputElement).value)}
        step="0.01"
        class="w-full bg-transparent text-center text-gray-900 dark:text-gray-100 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20 rounded px-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
    </td>
  )
}
