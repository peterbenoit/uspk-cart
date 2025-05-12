
export default function Button({ type = "button", onClick, children, className = "bg-indigo-600 hover:bg-indigo-700 text-white" }) {
	return (
		<button
			type={type}
			onClick={onClick}
			className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${className}`}
		>
			{children}
		</button>
	);
}
