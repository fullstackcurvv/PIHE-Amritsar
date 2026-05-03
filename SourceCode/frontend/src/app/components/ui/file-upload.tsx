import * as React from "react";
import { cn } from "./utils";
import { Upload, X, FileIcon, CheckCircle2 } from "lucide-react";

export interface FileUploadProps {
  label?: string;
  required?: boolean;
  error?: string;
  accept?: string;
  maxSize?: number;
  onChange?: (file: File | null) => void;
  value?: File | null;
  helperText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  required,
  error,
  accept = "image/*,.pdf",
  maxSize = 5 * 1024 * 1024,
  onChange,
  value,
  helperText,
}) => {
  const [file, setFile] = React.useState<File | null>(value || null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > maxSize) {
        alert(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
        return;
      }
      setFile(selectedFile);
      onChange?.(selectedFile);

      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result as string);
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-orange-500 transition-colors",
          error ? "border-red-500" : "border-gray-300",
          file && "border-green-500 bg-green-50"
        )}
        onClick={() => !file && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />

        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {preview ? (
                <img src={preview} alt="Preview" className="h-12 w-12 object-cover rounded" />
              ) : (
                <FileIcon className="h-8 w-8 text-green-600" />
              )}
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="p-1 hover:bg-red-100 rounded-full"
            >
              <X className="h-5 w-5 text-red-600" />
            </button>
          </div>
        ) : (
          <div>
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              Click to upload or drag and drop
            </p>
            {helperText && (
              <p className="text-xs text-gray-500 mt-1">{helperText}</p>
            )}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
