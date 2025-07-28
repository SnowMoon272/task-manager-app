import { ChangeEvent } from "react";

interface TextInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  minLength?: number;
  type?: "text" | "email" | "tel";
}

export default function TextInput({
  id,
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  minLength,
  type = "text",
}: TextInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={handleChange}
        className="w-full px-3 py-2 bg-gray-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        minLength={minLength}
      />
    </div>
  );
}

