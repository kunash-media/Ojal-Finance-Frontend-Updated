import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import ChartCard from './ChartCard';
import StatCards from './StatCards';
import CustomersTable from './CustomersTable';
import { lineChartData, barChartData, pieChartData, PIECHART_COLORS,doughnutData, DOUGHNUT_COLORS} from '../../data/dummyData';
import { colors } from '../../utils/colors';

function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 ">Dashboard</h1>
      
      {/* Stat Cards */}
      <StatCards />
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <ChartCard title="Account Growth" description="Monthly account balance trends">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart 
              data={lineChartData} 
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="savings" stroke={colors.airForceBlue} strokeWidth={2} />
              <Line type="monotone" dataKey="fd" stroke={colors.caramel} strokeWidth={2} />
              <Line type="monotone" dataKey="rd" stroke={colors.amaranth} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar Chart */}
        <ChartCard title="Loan Activity" description="Monthly loan disbursements and repayments">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart 
              data={barChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="loans" fill={colors.caramel} />
              <Bar dataKey="repaid" fill={colors.airForceBlue} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pie Chart */}
        <ChartCard title="Account Distribution" description="Distribution of account types">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIECHART_COLORS[index % PIECHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Doughnut Chart */}
        <ChartCard title="Loan Types" description="Distribution of different loan types">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={doughnutData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {doughnutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DOUGHNUT_COLORS[index % DOUGHNUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Customers Table */}
      <CustomersTable />
      <div class="border-t border-gray-300 text-center py-4 text-sm text-gray-600">© {new Date().getFullYear()} Ojal Finance. All Rights Reserved | Developed by Kunash Media Solutions.</div>
    </div>
  );
}

export default Dashboard;