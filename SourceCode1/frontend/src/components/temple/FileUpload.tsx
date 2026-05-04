import { Upload, X } from 'lucide-react'

interface FileUploadProps {
  label: string
  preview?: boolean
  value?: string | null
  onChange: (file: string | null) => void
  accept?: string
}

export const TempleFileUpload = ({
  label,
  preview = false,
  value,
  onChange,
  accept = 'image/*',
}: FileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        onChange(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemove = () => {
    onChange(null)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>

      {!value ? (
        <label className="cursor-pointer">
          <div className="border-2 border-dashed border-[#E8720C] rounded-md p-4 hover:bg-orange-50 transition-colors">
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-[#E8720C]" />
              <span className="text-xs text-gray-600">Click to upload or drag and drop</span>
              <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
            </div>
          </div>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
          />
        </label>
      ) : (
        <div className="relative border-2 border-[#E8720C] rounded-md p-3">
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            aria-label="Remove file"
          >
            <X className="w-3 h-3" />
          </button>
          {preview ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-24 object-contain"
            />
          ) : (
            <div className="text-center text-xs text-gray-600">File uploaded successfully</div>
          )}
        </div>
      )}
    </div>
  )
}
