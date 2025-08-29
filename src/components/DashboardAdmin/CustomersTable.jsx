import { customersData } from '../../data/dummyData';

function CustomersTable() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 ">
        <h2 className="text-lg font-semibold text-gray-800 ">Recent Daily Collections</h2>
        <p className="text-sm text-gray-500 ">List of recently collected customers</p>
      </div>
      <div className="overflow-x-auto overflow-y-auto h-[300px]">
        <table className="min-w-full divide-y divide-gray-300 ">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Account Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white  divide-y divide-gray-200 ">
            {customersData.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 ">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{customer.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-medium text-gray-900 ">{customer.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.accountType}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`${customer.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${Math.abs(customer.balance).toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${customer.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    {customer.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomersTable;