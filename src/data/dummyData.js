import { colors } from '../utils/colors';

export const lineChartData = [
  { name: 'Jan', savings: 4000, fd: 2400, rd: 2400 },
  { name: 'Feb', savings: 3000, fd: 1398, rd: 2210 },
  { name: 'Mar', savings: 2000, fd: 9800, rd: 2290 },
  { name: 'Apr', savings: 2780, fd: 3908, rd: 2000 },
  { name: 'May', savings: 1890, fd: 4800, rd: 2181 },
  { name: 'Jun', savings: 2390, fd: 3800, rd: 2500 },
];

export const barChartData = [
  { name: 'Jan', loans: 4000, repaid: 2400 },
  { name: 'Feb', loans: 3000, repaid: 1398 },
  { name: 'Mar', loans: 2000, repaid: 9800 },
  { name: 'Apr', loans: 2780, repaid: 3908 },
  { name: 'May', loans: 1890, repaid: 4800 },
  { name: 'Jun', loans: 2390, repaid: 3800 },
];

export const pieChartData = [
  { name: 'Savings', value: 400 },
  { name: 'FD', value: 300 },
  { name: 'RD', value: 300 },
  { name: 'Loans', value: 200 },
];

export const PIECHART_COLORS = [colors.airForceBlue, colors.caramel, colors.amaranth, '#8884d8'];

export const doughnutData = [
  { name: 'Home Loans', value: 400 },
  { name: 'Personal Loans', value: 300 },
  { name: 'Education Loans', value: 300 },
  { name: 'Business Loans', value: 200 },
];

export const DOUGHNUT_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const customersData = [
  { id: 1, name: 'John Doe', email: 'john@example.com', accountType: 'Savings', balance: 5000, status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', accountType: 'FD', balance: 10000, status: 'Active' },
  { id: 3, name: 'Robert Brown', email: 'robert@example.com', accountType: 'RD', balance: 7500, status: 'Active' },
  { id: 4, name: 'Emily Wilson', email: 'emily@example.com', accountType: 'Loan', balance: -15000, status: 'Active' },
  { id: 5, name: 'Michael Clark', email: 'michael@example.com', accountType: 'Savings', balance: 3200, status: 'Inactive' },
  { id: 6, name: 'Robert Brown', email: 'robert@example.com', accountType: 'RD', balance: 7500, status: 'Active' },
];

export const statCardsData = [
  { title: 'Total Customers', value: '380', icon: 'Users', color: colors.airForceBlue },
  { title: 'Total Savings', value: '160', icon: 'HandCoins', color: colors.caramel },
  { title: 'Fixed Deposits', value: '80', icon: 'Building', color: colors.amaranth },
  { title: 'Active Loans', value: '45', icon: 'FileText', color: colors.airForceBlue },
];