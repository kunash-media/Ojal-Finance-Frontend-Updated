
function PagePlaceholder({ title }) {
  return (
    <div className="bg-white rounded-lg shadow p-10 text-center">
      <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
      <p className="text-gray-500 mt-2">
        This page is under construction. Component will be implemented based on specific requirements.
      </p>
    </div>
  );
}

export default PagePlaceholder;