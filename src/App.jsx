import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import FinanceAdminLayout from "./components/FinanceAdminPanel";
import Dashboard from './components/DashboardAdmin/Dashboard';
import CreateSaving from './components/Saving/CreateSaving';
import PagePlaceholder from './components/PagePlaceholder';
import AddCustomerForm from "./components/Add-customer/AddCustomerForm";
import LoginForm from "./components/Login-SignUp/LoginPage";
import SignUp from "./components/Login-SignUp/SignUp";
import DailyCollection from "./components/Daily-collection/DailyCollection";
import RecurringDeposit from "./components/Recurring-deposit/RecurringDeposit.jsx";
import FixedDeposit from "./components/Fixed-Deposit/FixedDeposit.jsx";
import UserList from "./components/Users-list/UserList.jsx";
import LoanApplicationForm from "./components/Loan-section/LoanAgreement.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <UserProvider>
          <Routes>
            <Route path="/" element={<FinanceAdminLayout />}>
              {/*----Nested routes that will render inside the FinanceAdminLayout ----*/}
                <Route index element={<Dashboard />} />
                <Route path = "add-customer" element={<AddCustomerForm/>} />
                <Route path = "create-saving" element={<CreateSaving />} />
                <Route path = "create-rd" element={<RecurringDeposit/>} />
                <Route path = "create-fd" element={<FixedDeposit />} />
                <Route path = "apply-loan" element={<LoanApplicationForm/>} />
                <Route path = "reports" element={<PagePlaceholder title="Reports"/>} />
                <Route path = "daily-collection" element={<DailyCollection/>}/>
                <Route path = "all-customers" element={<UserList/>}/>
            </Route>
            <Route path = "/login" element={<LoginForm/>}/>
            <Route path = "/signup" element={<SignUp/>}/>
          </Routes> 
        </UserProvider>
      </AuthProvider>     
    </Router>
  );
}

export default App;