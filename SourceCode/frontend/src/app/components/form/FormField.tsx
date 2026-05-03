import * as React from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  options?: { value: string; label: string }[];
  variant?: "input" | "select" | "textarea";
  disabled?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  type = "text",
  value = "",
  onChange,
  placeholder,
  options = [],
  variant = "input",
  disabled = false,
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {variant === "input" && (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={error ? "border-red-500" : ""}
          disabled={disabled}
        />
      )}

      {variant === "select" && (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger className={error ? "border-red-500" : ""}>
            <SelectValue placeholder={placeholder || "Select..."} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {variant === "textarea" && (
        <Textarea
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className={error ? "border-red-500" : ""}
          disabled={disabled}
        />
      )}

      {error && <p className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};
