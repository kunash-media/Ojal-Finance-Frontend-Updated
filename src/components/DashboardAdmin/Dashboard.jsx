import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartCard from './ChartCard';
import StatCards from './StatCards';
import CustomersTable from './CustomersTable';
import { colors } from '../../utils/colors';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const { user } = useAuth();
  const [statsData, setStatsData] = useState([]);
  const [lineChartData, setLineChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);
  const [loanTrendsData, setLoanTrendsData] = useState([]);
  const [loanTypesData, setLoanTypesData] = useState([]);
  const [customersData, setCustomersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colors for charts
  const PIECHART_COLORS = [colors.airForceBlue, colors.caramel, colors.amaranth];
  // Explicitly define DOUGHNUT_COLORS to ensure colors are applied
  const DOUGHNUT_COLORS = [
    '#2ECC71', // emerald
    '#00CED1', // cyan
    '#FF9933', // vividTangerine
    '#32CD32'  // lime
  ];

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.branchName) return;
      setLoading(true);
      try {
        // Fetch stats
        const statsResponse = await axios.get('https://api.ojalmsfoundation.in/api/dashboard/stats', {
          params: { branchName: user.branchName }
        });
        const stats = [
          { title: 'Total Customers', value: statsResponse.data.totalUsers, icon: 'Users', color: colors.airForceBlue },
          { title: 'Total Savings Balance', value: `₹${statsResponse.data.totalSavings.toLocaleString()}`, icon: 'HandCoins', color: colors.caramel },
          { title: 'Total FD Balance', value: `₹${statsResponse.data.totalFd.toLocaleString()}`, icon: 'Building', color: colors.amaranth },
          { title: 'Total RD Balance', value: `₹${statsResponse.data.totalRd.toLocaleString()}`, icon: 'ChartLine', color: colors.emerald },
          { title: 'Total Loan Disbursed', value: `₹${statsResponse.data.totalLoans.toLocaleString()}`, icon: 'FileText', color: colors.vividTangerine }
        ];
        setStatsData(stats);

        // Fetch account trends (LineChart)
        const trendsResponse = await axios.get('https://api.ojalmsfoundation.in/api/dashboard/account-trends', {
          params: { branchName: user.branchName }
        });
        setLineChartData(trendsResponse.data);

        // Fetch loan trends (BarChart)
        const loanTrendsResponse = await axios.get('https://api.ojalmsfoundation.in/api/dashboard/loan-trends', {
          params: { branchName: user.branchName }
        });
        setLoanTrendsData(loanTrendsResponse.data);

        // Fetch loan types (DoughnutChart)
        const loanTypesResponse = await axios.get('https://api.ojalmsfoundation.in/api/dashboard/loan-types', {
          params: { branchName: user.branchName }
        });
        setLoanTypesData(loanTypesResponse.data);

        // Fetch account distribution (PieChart)
        const distributionResponse = await axios.get('https://api.ojalmsfoundation.in/api/dashboard/account-distribution', {
          params: { branchName: user.branchName }
        });
        setPieChartData(distributionResponse.data);

        // Fetch recent customers
        const customersResponse = await axios.get('https://api.ojalmsfoundation.in/api/dashboard/recent-customers', {
          params: { branchName: user.branchName }
        });
        setCustomersData(customersResponse.data);
      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.branchName]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <svg className="animate-spin h-8 w-8 text-teal-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[300px] bg-white rounded-lg shadow-md p-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-24 w-24 text-teal-600 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">No Data Available</h2>
      <p className="text-gray-600 text-center">We're sorry, but we couldn't fetch the dashboard data. Please try again later or contact support.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 ">Dashboard</h1>
      
      {/* Stat Cards */}
      <StatCards statCardsData={statsData} />
      
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
              data={loanTrendsData}
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
                data={loanTypesData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {loanTypesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={DOUGHNUT_COLORS[index % DOUGHNUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Customers Table */}
      <CustomersTable customersData={customersData} />
      <div className="border-t border-gray-300 text-center py-4 text-sm text-gray-600">
        © {new Date().getFullYear()} Ojal Finance. All Rights Reserved | Developed by Kunash Media Solutions.
      </div>
    </div>
  );
}

export default Dashboard;