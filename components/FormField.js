// /Users/peterbenoit/GitHub/NextjsEcommerceTemplateGemini25/components/FormField.js
export default function FormField({ label, id, type = "text", name, value, onChange, required, placeholder, rows, step, min }) {
	const InputComponent = type === "textarea" ? "textarea" : "input";
	return (
		<div>
			<label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
				{label}
			</label>
			<InputComponent
				type={type}
				id={id}
				name={name}
				value={value}
				onChange={onChange}
				required={required}
				placeholder={placeholder}
				rows={rows}
				step={step}
				min={min}
				className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-50"
			/>
		</div>
	);
}
