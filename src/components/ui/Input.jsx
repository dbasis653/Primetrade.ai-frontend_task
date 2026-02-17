function Input({
  label,
  type = "text",
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
}) {
  return (
    <div className="mb-4">
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
          error ? "border-red-500 focus:ring-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default Input;
