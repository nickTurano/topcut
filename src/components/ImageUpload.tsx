import { useRef } from 'preact/hooks'

interface Props {
  onImageSelected: (base64: string, mediaType: string) => void
  disabled?: boolean
}

export function ImageUpload({ onImageSelected, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      const [header, base64] = dataUrl.split(',')
      const mediaType = header.match(/data:(.*?);/)?.[1] || 'image/png'
      onImageSelected(base64, mediaType)
    }
    reader.readAsDataURL(file)
  }

  const handleChange = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer?.files?.[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
  }

  return (
    <div
      class={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
        disabled
          ? 'border-gray-200 dark:border-gray-800 opacity-50'
          : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer'
      }`}
      onClick={() => !disabled && inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        class="hidden"
        disabled={disabled}
      />
      <div class="text-4xl mb-3">📸</div>
      <p class="text-gray-600 dark:text-gray-400 text-sm">
        Tap to take a photo or upload a screenshot
      </p>
      <p class="text-gray-400 dark:text-gray-600 text-xs mt-1">
        Supports PNG, JPG, WebP
      </p>
    </div>
  )
}
