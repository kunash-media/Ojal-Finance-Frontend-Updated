export function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-xl shadow ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
