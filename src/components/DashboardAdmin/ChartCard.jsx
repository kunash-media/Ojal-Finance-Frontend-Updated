
function ChartCard({ title, description, children }) {
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 ">{title}</h2>
        <p className="text-sm text-gray-500 ">{description}</p>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default ChartCard;