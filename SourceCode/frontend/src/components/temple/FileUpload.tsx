import { useRef, useState } from 'react'
import { Upload, X, FileIcon, CheckCircle2 } from 'lucide-react'

interface TempleFileUploadProps {
  label: string
  required?: boolean
  error?: string
  accept?: string
  maxSizeMB?: number
  value: string | null
  onChange: (base64: string | null) => void
  helperText?: string
}

export const TempleFileUpload = ({
  label,
  required,
  error,
  accept = 'image/*',
  maxSizeMB = 5,
  value,
  onChange,
  helperText,
}: TempleFileUploadProps) => {
  const [meta, setMeta] = useState<{ name: string; size: string } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`File must be smaller than ${maxSizeMB}MB`)
      return
    }
    setMeta({ name: file.name, size: `${(file.size / 1024).toFixed(1)} KB` })
    const reader = new FileReader()
    reader.onloadend = () => onChange(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    onChange(null)
    setMeta(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  const isImage = value?.startsWith('data:image/')

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div
        className={[
          'border-2 border-dashed rounded-lg p-4 transition-colors',
          error ? 'border-red-500 bg-red-50' : value ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-[#E8720C]',
          !value ? 'cursor-pointer' : '',
        ].join(' ')}
        onClick={() => !value && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />

        {value ? (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {isImage ? (
                <img src={value} alt="Preview" className="h-12 w-12 object-cover rounded flex-shrink-0" />
              ) : (
                <FileIcon className="h-8 w-8 text-green-600 flex-shrink-0" />
              )}
              <div className="min-w-0">
                {meta && (
                  <>
                    <p className="text-sm font-medium text-gray-900 truncate">{meta.name}</p>
                    <p className="text-xs text-gray-500">{meta.size}</p>
                  </>
                )}
                {!meta && <p className="text-sm font-medium text-gray-900">File uploaded</p>}
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            </div>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); handleRemove() }}
              className="p-1 hover:bg-red-100 rounded-full transition-colors flex-shrink-0"
            >
              <X className="h-5 w-5 text-red-600" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
            {helperText && <p className="text-xs text-gray-400 mt-1">{helperText}</p>}
          </div>
        )}
      </div>

      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  )
}
