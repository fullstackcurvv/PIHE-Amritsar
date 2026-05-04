import { useRef, useState, DragEvent, ChangeEvent } from 'react'
import { Upload, CheckCircle, X } from 'lucide-react'

interface FileUploadZoneProps {
  accept?: string
  maxSizeMB?: number
  onFile: (file: File) => void
  label?: string
  hint?: string
}

export function FileUploadZone({
  accept = '.pdf',
  maxSizeMB = 10,
  onFile,
  label = 'Upload your answer paper',
  hint,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFile = (file: File) => {
    setError(null)
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) {
      setError(`File must be smaller than ${maxSizeMB}MB`)
      return
    }
    setSelectedFile(file)
    onFile(file)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const clearFile = () => {
    setSelectedFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="w-full">
      {selectedFile ? (
        <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-green-200 bg-green-50">
          <CheckCircle size={20} className="text-green-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-green-800 truncate">{selectedFile.name}</p>
            <p className="text-xs text-green-600">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={clearFile}
            className="p-1 rounded-lg hover:bg-green-100 transition-colors"
            aria-label="Remove file"
          >
            <X size={16} className="text-green-600" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`
            w-full rounded-xl border-2 border-dashed p-6 text-center cursor-pointer
            transition-all duration-200
            ${dragging
              ? 'border-[#E8720C] bg-orange-50'
              : 'border-gray-300 hover:border-[#E8720C] hover:bg-orange-50/30'
            }
          `}
        >
          <Upload size={28} className="mx-auto mb-2 text-gray-400" />
          <p className="text-sm font-semibold text-gray-700">{label}</p>
          {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
          <p className="text-xs text-gray-400 mt-2">
            Drag & drop or <span style={{ color: '#E8720C' }}>browse files</span>
          </p>
          <p className="text-xs text-gray-300 mt-1">
            {accept.toUpperCase()} up to {maxSizeMB}MB
          </p>
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
