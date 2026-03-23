import { useState } from 'preact/hooks'

const STORAGE_KEY = 'topcut_api_key'

export function getApiKey(): string {
  return localStorage.getItem(STORAGE_KEY) || ''
}

export function setApiKey(key: string) {
  if (key) {
    localStorage.setItem(STORAGE_KEY, key)
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

interface Props {
  open: boolean
  onClose: () => void
  onSave: (key: string) => void
}

export function ApiKeyModal({ open, onClose, onSave }: Props) {
  const [key, setKey] = useState(getApiKey())

  if (!open) return null

  const handleSave = () => {
    setApiKey(key.trim())
    onSave(key.trim())
    onClose()
  }

  return (
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div class="bg-white dark:bg-gray-900 rounded-xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">API Key</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Enter your Anthropic API key. It's stored only in your browser's local storage and sent directly to Anthropic's API.
        </p>
        <input
          type="password"
          value={key}
          onInput={(e) => setKey((e.target as HTMLInputElement).value)}
          placeholder="sk-ant-..."
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        <div class="flex gap-2 justify-end">
          <button
            onClick={onClose}
            class="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
