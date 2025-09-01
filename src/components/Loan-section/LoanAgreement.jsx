import React, { useState, useRef, useEffect } from 'react';
import {
  Download, Upload, X, Plus, Calendar, User, Building,
  FileText, Dock, ChevronRight, ArrowLeft,
  ArrowRight, CheckCircle, Scale, Check
} from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { toast,ToastContainer } from 'react-toastify';

const SuccessPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 text-center mb-6">
            Your loan application has been submitted successfully. You can download the application form for your records.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const LoanAgreement = ({ formData, onAgree, isAgreed }) => {
  return (
    <div className="mt-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-8 border border-yellow-200 shadow-lg">
      {/* <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <img src="https://via.placeholder.com/80x80/0066cc/ffffff?text=OJAL" alt="Company Logo" className="w-16 h-16 rounded-full mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-blue-800">OJAL MICRO FINANCE</h1>
            <p className="text-sm text-gray-600">CIN: U88900PN2023NPL219300</p>
          </div>
        </div>
        <h2 className="text-xl font-bold text-yellow-800 underline">LOAN AGREEMENT</h2>
      </div> */}

      <div className="text-sm text-gray-700 space-y-4 leading-relaxed">
        <div className="bg-white p-4 rounded-lg border border-yellow-200">
          <p className="mb-2 text-center" >
            <strong>This LOAN AGREEMENT "Personal Loan" Agreement executed</strong>
          </p>
          <p className="mb-2 text-center" id="center-text-id">
            <strong>Between</strong>
          </p>
          <p className="mb-1">
            Mr./Miss/Mrs. <strong>{formData.memberName || '[Borrower Name]'}</strong> S/o <strong>{formData.fatherName || '[Father Name]'}</strong>,
            R/O <strong>{formData.address || '[Borrower Address]'}</strong> hereinafter referred as "<strong>borrower</strong>".
          </p>
          <p className="mb-0 text-center" id="center-text-id">
            <strong>And</strong>
          </p>
          <p className="mb-4">
            M/s <strong>OJAL MICRO SERVICE FOUNDATION</strong>, A section-8 company incorporated under the companies act, 2013, in MGT 14 under micro finance financial activities and loan provide this company
            having registered office at <strong>SN73 Adarsh Nagar, Ashtavinayak Colony, Dighi Pune -411015</strong> hereinafter referred as "<strong>Lender</strong>".
          </p>

          <p className="mb-4">
            <strong>IN CONSIDERATION OF</strong> the Lender loaning certain monies (the Loan) to the Borrower, and the Borrower repaying the Loan to the Lender,
            the parties agree to keep, perform and fulfill the promises and conditions set out in this Agreement.
          </p>

          <p className="mb-4">
            <strong>WHEREAS</strong> the Borrower is in need of funds and hence has approached the Lender to grant her Rs. {parseFloat(formData.loanAmount || 0).toLocaleString('en-IN')} /-
            for a period of {formData.tenure || '0'} Months.
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">LOAN DETAILS</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Loan Amount:</span>
                  <span className="font-semibold">₹{parseFloat(formData.loanAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span className="font-semibold">₹{parseFloat(formData.processingFee || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Disbursed Amount:</span>
                  <span className="font-semibold">₹{((parseFloat(formData.loanAmount) || 0) - (parseFloat(formData.processingFee) || 0)).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Interest Rate:</span>
                  <span className="font-semibold">{formData.roi || '0'}% per annum</span>
                </div>
                <div className="flex justify-between">
                  <span>Tenure:</span>
                  <span className="font-semibold">{formData.tenure || '0'} Months</span>
                </div>
                <div className="flex justify-between">
                  <span>EMI Amount:</span>
                  <span className="font-semibold">₹{parseFloat(formData.emiAmount || 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Payable:</span>
                  <span className="font-semibold">₹{(parseFloat(formData.emiAmount || 0) * parseInt(formData.tenure || 0)).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3">BORROWER DETAILS</h3>
              <div className="space-y-1 text-sm">
                <div><strong>Name:</strong> {formData.memberName || 'N/A'}</div>
                <div><strong>Father's Name:</strong> {formData.fatherName || 'N/A'}</div>
                {/* <div><strong>Member No:</strong> {formData.memberNo || 'N/A'}</div> */}
                <div><strong>Mobile:</strong> {formData.mobile || 'N/A'}</div>
                <div><strong>Purpose:</strong> {formData.purposeOfLoan || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-justify">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Loan Amount & Interest:</h4>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>The Borrower hereto, requiring money, has requested the Lender to give her a with interest loan of Rs. {parseFloat(formData.loanAmount || 0).toLocaleString('en-IN')} /-</li>
                <li>The said loan is required by the Borrower for a period of {formData.tenure || '0'} Months</li>
                <li>The Borrower hereby agrees and undertakes to return the loan of Rs. {parseFloat(formData.loanAmount || 0).toLocaleString('en-IN')} /- within the aforesaid period of {formData.tenure || '0'} Months and, gives his personal guarantee for the same.</li>
                <li>The terms and conditions of this Agreement are arrived at by the mutual consent of the parties hereto.</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Payment:</h4>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li>This Loan will be repaid in full on the due date.</li>
                <li>At any time while not in default under this Agreement, the Borrower may make lump sum payments or pay the outstanding balance then owing under this agreement to the lender without further bonus or penalty.</li>
              </ol>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Default:</h4>
              <p>Notwithstanding anything to the contrary in this agreement, if the Borrower defaults in the performance of any obligation under this agreement, then the lender may declare the amount owing under this Agreement at that time to be immediately due and payable.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Governing Law:</h4>
              <p>This Agreement will be construed in accordance with and governed by the laws of the State.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Cost:</h4>
              <p>The Borrower shall be liable for all costs, expenses and expenditures incurred including, without limitation, the complete legal costs of the lender incurred by enforcing this a result of any default by the Borrower and such costs will be added to the principal then outstanding and shall be due and payable by the Borrower to the Lender immediately upon demand of the Lender.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Binding Effect:</h4>
              <p>This Agreement will pass to the benefit of and be binding upon the respective heirs, executors, administrators, successors and permitted assigns of the Borrower and Lender. The Borrower waives presentment for payment, notice of non-payment, protest, and notice of protest.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Amendments:</h4>
              <p>This Agreement may only be amended or modified by a written instrument executed by both the Borrower and the Lender.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Severability:</h4>
              <p>The Clauses and paragraphs contained in this agreement are intended to be read and construed independently of each other. If any term, covenant, condition or provision of this agreement id held by a court of competent jurisdiction to be invalid, void or unenforceable, it is the parties' intent that such provision be reduced in scope by the court to the extent deemed necessary by the court to render the provision reasonable and enforceable and the remainder of the provisions of this agreement will in no way be affected, i impaired or invalidated as a result.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">General Provisions:</h4>
              <p>Headings are inserted for the convenience of the parties only and are not to be considered when interpreting this agreement. Words in the singular mean and include the plural and vice versa. Words in the masculine mean and include the feminine and vice versa.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Entire Agreement:</h4>
              <p>This agreement constitutes the entire agreement between the parties and there are no further items or provisions, either oral or otherwise.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">IN WITNESS WHEREOF:</h4>
              <p>The parties hereto have hereunto set and subscribed their respective hands the day and year first hereinabove written.</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200 mt-6">
          <h4 className="font-semibold text-red-800 mb-2">IMPORTANT NOTICE:</h4>
          <p className="text-sm text-red-700">
            By signing this agreement, the Borrower acknowledges having read, understood, and agreed to all the terms
            and conditions mentioned herein. This agreement is legally binding and enforceable under Indian law.
          </p>
        </div>

        <div className="flex items-start mt-6 p-4 bg-white rounded-lg border border-gray-300">
          <input
            type="checkbox"
            id="agreement"
            checked={isAgreed}
            onChange={onAgree}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 mr-3"
            required
          />
          <label htmlFor="agreement" className="text-sm text-gray-700 leading-relaxed">
            <strong>I, {formData.memberName || '[Borrower Name]'}, hereby acknowledge that:</strong>
            <br />
            • I have read and understood all the terms and conditions of this Loan Agreement
            <br />
            • I agree to comply with all the terms mentioned in this agreement
            <br />
            • I understand the consequences of default and agree to the penalty structure
            <br />
            • All information provided by me is true and accurate to the best of my knowledge
            <br />
            • I agree to use the loan amount solely for the stated purpose
            <br />
            <strong>I hereby accept this Loan Agreement and agree to be bound by its terms and conditions.</strong>
          </label>
        </div>
      </div>
    </div>
  );
};

const LoanApplicationForm = () => {

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    applicationNo: '',
    purposeOfLoan: '',
    loanScheme: '',
    loanAmount: '',
    roi: '',
    appliedDate: new Date().toISOString().split('T')[0],
    tenure: '',
    emiAmount: '',
    memberName: '',
    fatherName: '',
    mobile: '',
    dateOfJoining: '',
    memberType: '',
    branchName: '',
    address: '',
    panNumber: '',
    adhaarNumber: '',
    grantorName: '',
    grantorAddress: '',
    grantorMobile: '',
    nomineeName: '',
    nomineeAddress: '',
    nomineeMobile: '',
    processingFee: '855',
    disbursedAmount: '',
    photo: null,
    applicantSignature: null,
    guarantorSignature: null,
    branchSeal: null,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const photoInputRef = useRef(null);
  const applicantSigInputRef = useRef(null);
  const guarantorSigInputRef = useRef(null);
  const branchSealInputRef = useRef(null);
  const formRef = useRef(null);

  const steps = [
    { id: 1, title: 'Loan Details', icon: Dock },
    { id: 2, title: 'Personal Info', icon: User },
    { id: 3, title: 'Documents', icon: FileText },
    { id: 4, title: 'Agreement', icon: Scale },
    { id: 5, title: 'Review & Submit', icon: Download }
  ];

  const breadcrumbs = [
    // { label: 'Home', href: '#', icon: Home },
    { label: 'Loan Application', href: '', icon: Dock },
    { label: steps[currentStep - 1]?.title || 'Form', current: true }
  ];

  // Function to generate random application number
  const generateApplicationNumber = () => {
    const currentYear = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 900000) + 100000; // 6-digit random number
    return `OJL${currentYear}${randomNum}`;
  };

  useEffect(() => {
    calculateEMI();
  }, [formData.loanAmount, formData.roi, formData.tenure]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  const calculateEMI = () => {
    const processingFee = parseFloat(formData.processingFee) || 0;
    const loanAmount = parseFloat(formData.loanAmount) || 0;
    const disbursedAmount = loanAmount - processingFee;
    const rate = (parseFloat(formData.roi) || 0) / 100 / 12;
    const tenure = parseInt(formData.tenure) || 0;

    setFormData(prev => ({ ...prev, disbursedAmount: disbursedAmount.toString() }));

    if (disbursedAmount > 0 && rate > 0 && tenure > 0) {
      const emi = (disbursedAmount * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
      const roundedEMI = Math.round(emi);
      setFormData(prev => ({ ...prev, emiAmount: roundedEMI.toString() }));
    } else {
      setFormData(prev => ({ ...prev, emiAmount: '0' }));
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          [type]: e.target.result
        }));
        if (errors[type]) {
          setErrors(prev => ({
            ...prev,
            [type]: ''
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (type) => {
    setFormData(prev => ({
      ...prev,
      [type]: null
    }));
    if (type === 'photo' && photoInputRef.current) {
      photoInputRef.current.value = '';
    }
    if (type === 'applicantSignature' && applicantSigInputRef.current) {
      applicantSigInputRef.current.value = '';
    }
    if (type === 'guarantorSignature' && guarantorSigInputRef.current) {
      guarantorSigInputRef.current.value = '';
    }
    if (type === 'branchSeal' && branchSealInputRef.current) {
      branchSealInputRef.current.value = '';
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      //   if (!formData.applicationNo) newErrors.applicationNo = 'Application number is required';
      if (!formData.loanAmount) newErrors.loanAmount = 'Loan amount is required';
      if (!formData.roi) newErrors.roi = 'Interest rate is required';
      if (!formData.tenure) newErrors.tenure = 'Tenure is required';

      if (formData.loanAmount && parseFloat(formData.loanAmount) <= 0) {
        newErrors.loanAmount = 'Loan amount must be greater than 0';
      }
      if (formData.roi && (parseFloat(formData.roi) <= 0 || parseFloat(formData.roi) > 50)) {
        newErrors.roi = 'Interest rate must be between 0 and 50%';
      }
      if (formData.tenure && (parseInt(formData.tenure) <= 0 || parseInt(formData.tenure) > 60)) {
        newErrors.tenure = 'Tenure must be between 1 and 60 months';
      }
    }

    if (step === 2) {
      if (!formData.memberName) newErrors.memberName = 'Member name is required';
      if (!formData.fatherName) newErrors.fatherName = 'Father name is required';
      if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
      //   if (!formData.memberNo) newErrors.memberNo = 'Member number is required';
      if (!formData.dateOfJoining) newErrors.dateOfJoining = 'Date of joining is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.grantorName) newErrors.grantorName = 'Grantor name is required';
      if (!formData.nomineeName) newErrors.nomineeName = 'Nominee name is required';

      if (formData.mobile && !/^\d{10}$/.test(formData.mobile)) {
        newErrors.mobile = 'Mobile number must be 10 digits';
      }

      if (formData.dateOfJoining) {
        const joiningDate = new Date(formData.dateOfJoining);
        const today = new Date();
        if (joiningDate > today) {
          newErrors.dateOfJoining = 'Date of joining cannot be in the future';
        }
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && !completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }

    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (currentStep === 4) {
      // On agreement step, just check if agreement is checked
      if (!isAgreementChecked) {
        alert('Please accept the loan agreement to proceed');
        return;
      }
    } else if (!validateStep(currentStep)) {
      return;
    }

    // Generate application number after completing step 4
    if (currentStep === 4 && !formData.applicationNo) {
      const newApplicationNo = generateApplicationNumber();
      setFormData(prev => ({
        ...prev,
        applicationNo: newApplicationNo
      }));
    }

    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step) => {
    if (step <= currentStep || completedSteps.includes(step - 1)) {
      setCurrentStep(step);
    }
  };

  const generateEMISchedule = () => {
    const principal = parseFloat(formData.loanAmount) || 0;
    const rate = (parseFloat(formData.roi) || 0) / 100 / 12;
    const tenure = parseInt(formData.tenure) || 0;

    const schedule = [];
    if (principal <= 0 || rate <= 0 || tenure <= 0) {
      return schedule;
    }

    const emi = parseFloat(formData.emiAmount) || 0;
    let balance = principal;

    for (let i = 1; i <= tenure && i <= 20; i++) {
      const interest = balance * rate;
      const principalPart = emi - interest;
      balance = Math.max(0, balance - principalPart);

      const date = new Date();
      date.setMonth(date.getMonth() + i);

      schedule.push({
        sNo: i,
        date: date.toLocaleDateString('en-GB'),
        interest: interest.toFixed(0),
        principal: principalPart.toFixed(0),
        amount: emi
      });
    }

    return schedule;
  };

  const generateStandardPDF = async () => {
    const emiSchedule = generateEMISchedule();

    // Format currency values for the agreement section
    const formattedLoanAmount = parseFloat(formData.loanAmount || 0).toLocaleString('en-IN');
    const formattedEmiAmount = parseFloat(formData.emiAmount || 0).toLocaleString('en-IN');
    const totalPayable = (parseFloat(formData.emiAmount || 0) * parseInt(formData.tenure || 0)).toLocaleString('en-IN');

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Loan Application - ${formData.applicationNo || 'N/A'}</title>
      <style>
      @page {
        margin: 23mm 15mm 15mm 15mm; /* Reduced top margin for page 1 */
        size: A4;
      }
      * {
        box-sizing: border-box;
      }

      #center-text-id{
        text-align : center ;
      }

      body { 
        font-family: 'Arial', sans-serif; 
        margin: 0; 
        padding: 0; 
        font-size: 10px; 
        line-height: 1.3;
        color: #333;
      }
      .page {
        min-height: 100vh;
        page-break-after: always;
        position: relative;
        padding-bottom: 30px; /* Reduced padding-bottom to save space */
      }
      .page:last-child {
        page-break-after: avoid;
      }
      .header { 
        display: flex;
        align-items: flex-start;
        margin-bottom: 20px; 
        border-bottom: 2px solid #0066cc;
        padding-bottom: 15px;
        position: relative;
      }
      .logo-container {
        position: absolute;
        left: 0;
        top: 0;
      }
      .logo-container img {
        height: 60px;
        width: auto;
      }
      .company-info {
        text-align: center;
        width: 100%;
      }
      .company-name {
        font-size: 24px;
        font-weight: bold;
        color: #672d91;
        margin-bottom: 5px;
      }
      .company-address {
        font-size: 9px;
        color: #666;
        margin-bottom: 10px;
      }
      .form-title {
        font-size: 16px;
        font-weight: bold;
        color: #333;
        text-decoration: underline;
        margin-top: 10px;
      }
      .form-container { 
        display: flex; 
        gap: 20px; 
        margin-bottom: 20px; 
      }
      .left-section { 
        flex: 2; 
      }
      .right-section { 
        flex: 1; 
        text-align: center;
      }
      .section { 
        border: 1px solid #333; 
        margin-bottom: 15px; 
        page-break-inside: avoid;
      }
      .section-title { 
        font-weight: bold; 
        background: #f5f5f5; 
        padding: 8px 12px; 
        margin: 0;
        border-bottom: 1px solid #333;
        font-size: 11px;
        text-transform: uppercase;
      }
      .section-content {
        padding: 10px;
      }
      .field-row { 
        display: flex; 
        margin-bottom: 6px; 
        align-items: center;
      }
      .field-label { 
        font-weight: bold; 
        width: 130px; 
        font-size: 9px;
        flex-shrink: 0; /* Prevent label from shrinking */
      }
      .field-value { 
        flex: 1; 
        border-bottom: 1px solid #ccc; 
        min-height: 16px; 
        padding: 2px 5px;
        font-size: 10px;
      }
      .split-row {
        display: flex;
        gap: 5px; /* Reduced gap between Grantor and Nominee fields */
        margin-bottom: 6px; /* Match field-row margin for consistency */
      }
      .split-field {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 2px; /* Reduced gap between label and value */
      }
      .split-field .field-label {
        width: auto; /* Override fixed width for split-field labels */
        min-width: 80px; /* Ensure label has enough space but not too much */
      }
      .split-field .field-value {
        flex: 1;
        padding-left: 2px; /* Reduced padding to minimize space */
      }
      .photo-container {
        border: 2px solid #333;
        width: 100px;
        height: 130px;
        margin: 0 auto 15px auto;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fafafa;
      }
      .photo-container img {
        max-width: 100%;
        max-height: 100%;
        object-fit: cover;
      }
      .signature-container {
        border: 1px solid #333;
        width: 180px;
        height: 50px;
        margin: 10px auto;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fafafa;
      }
      .signature-container img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      .signature-label {
        font-size: 9px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      .emi-table { 
        width: 100%; 
        border-collapse: collapse; 
        margin-top: 10px; 
        font-size: 8px;
      }
      .emi-table th, .emi-table td { 
        border: 1px solid #333; 
        padding: 4px 2px; 
        text-align: center; 
        vertical-align: middle;
      }
      .emi-table th { 
        background: #f0f0f0; 
        font-weight: bold;
        font-size: 8px;
      }
      .declaration { 
        font-size: 9px; 
        margin-top: 8px; /* Reduced margin-top */
        padding: 6px; /* Reduced padding */
        border: 1px solid #333;
        text-align: justify;
        line-height: 1.3;
        width: 100%; /* Ensure declaration width is reference for table */
        page-break-inside: avoid; /* Prevent declaration from splitting */
      }
      .declaration-title {
        font-weight: bold;
        font-size: 10px;
        margin-bottom: 5px; /* Reduced margin-bottom */
        text-decoration: underline;
        text-align: center;
      }
      .footer-signatures {
        margin-top: 10px; /* Reduced margin-top */
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        gap: 20px;
        page-break-inside: avoid; /* Prevent signatures from splitting */
      }
      .signature-section {
        text-align: center;
        flex: 1;
      }
      .signature-box {
        border: 1px solid #333;
        height: 60px;
        width: 150px;
        margin: 0 auto 10px auto;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fafafa;
      }
      .signature-box img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
      .signature-line {
        border-top: 1px solid #333;
        width: 140px;
        margin: 5px auto;
      }
      .print-info {
        font-size: 8px;
        color: #666;
        text-align: center;
        margin-top: 8px; /* Reduced margin-top */
        border-top: 1px solid #ccc;
        padding-top: 5px; /* Reduced padding-top */
        page-break-inside: avoid; /* Prevent print-info from splitting */
      }
      .agreement-section {
        margin: 20px 0;
        padding: 15px;
        border: 1px solid #ddd;
        background: #fffaf0;
      }
      .agreement-title {
        text-align: center;
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 15px;
        text-decoration: underline;
      }
      .agreement-content {
        font-size: 9px;
        line-height: 1.4;
        text-align: justify;
      }
      .agreement-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin: 15px 0;
      }
      .agreement-box {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background: #f9f9f9;
      }
      .agreement-box-title {
        font-weight: bold;
        margin-bottom: 8px;
        font-size: 10px;
      }
      .agreement-notice {
        background: #ffe6e6;
        padding: 10px;
        border: 1px solid #ff9999;
        margin: 15px 0;
        font-size: 9px;
      }
      .agreement-checkbox {
        margin-top: 15px;
        padding: 10px;
        border: 1px solid #ddd;
        background: #f9f9f9;
      }
      .agreement-header {
        display: flex;
        align-items: flex-start;
        margin-bottom: 20px;
        border-bottom: 2px solid #0066cc;
        padding-bottom: 15px;
        position: relative;
      }
      @media print {
        .no-print { display: none; }
        body { print-color-adjust: exact; }
        .page { page-break-after: always; }
        .page:last-child { page-break-after: avoid; }
      }
    </style>
  </head>
  <body>
    <!-- Page 1: Application Form -->
    <div class="page">
      <div class="header">
        <div class="logo-container">
          <img src="/src/assets/ojal-logo.png" alt="OJAL Micro Finance">
        </div>
        <div class="company-info">
          <div class="company-name">OJAL MICRO SERVICE FOUNDATION</div>
          <div class="company-address">
            CIN: U88900PN2023NPL219300<br>
            Address: SN73 Adarsh Nagar, Ashtavinayak Colony, Dighi Pune -411015<br>
            Email: ojalmicroservicefoundation.obs@gmail.com | Phone: +91-7499552539
          </div>
          <div class="form-title">LOAN APPLICATION FORM</div>
        </div>
      </div>
      
      <div class="form-container">
        <div class="left-section">
          <div class="section">
            <div class="section-title">Loan Details</div>
            <div class="section-content">
              <div class="field-row">
                <span class="field-label">Application No:</span>
                <span class="field-value">${formData.applicationNo || 'N/A'}</span>
              </div>
              <div class="field-row">
                <span class="field-label">Purpose of Loan:</span>
                <span class="field-value">${formData.purposeOfLoan || 'N/A'}</span>
              </div>
              <div class="field-row">
                <span class="field-label">Loan Scheme:</span>
                <span class="field-value">${formData.loanScheme || 'N/A'}</span>
              </div>
              <div class="field-row">
                <span class="field-label">Loan Amount:</span>
                <span class="field-value">₹ ${parseFloat(formData.loanAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div class="field-row">
                <span class="field-label">ROI (%):</span>
                <span class="field-value">${formData.roi || '0'}%</span>
              </div>
              <div class="field-row">
                <span class="field-label">Applied Date:</span>
                <span class="field-value">${formData.appliedDate ? new Date(formData.appliedDate).toLocaleDateString('en-GB') : 'N/A'}</span>
              </div>
              <div class="field-row">
                <span class="field-label">Tenure/Frequency:</span>
                <span class="field-value">${formData.tenure || '0'} Months</span>
              </div>
              <div class="field-row">
                <span class="field-label">EMI Amount:</span>
                <span class="field-value">₹ ${parseFloat(formData.emiAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div class="field-row">
                <span class="field-label">PAN Number:</span>
                <span class="field-value">${formData.panNumber || 'N/A'}</span>
              </div>
              <div class="field-row">
                <span class="field-label">Adhaar Number:</span>
                <span class="field-value">${formData.adhaarNumber || 'N/A'}</span>
              </div>
              <div class="field-row">
                <span class="field-label">Processing Fee:</span>
                <span class="field-value">₹${formData.processingFee || '₹855'}</span>
              </div>
              <div class="field-row">
                <span class="field-label">Disbursed Amount:</span>
                <span class="field-value">₹${((parseFloat(formData.loanAmount) || 0) - (parseFloat(formData.processingFee) || 0)).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Applicant Details</div>
            <div class="section-content">
             
              <div class="field-row">
                <span class="field-label">Member Name:</span>
                <span class="field-value">${formData.memberName || 'N/A'}</span>
              </div>
              <div class="field-row">
                <span class="field-label">Father/Husband Name:</span>
                <span class="field-value">${formData.fatherName || 'N/A'}</span>
              </div>
              <div class="field-row">
                <span class="field-label">Mobile No:</span>
                <span class="field-value">${formData.mobile || 'N/A'}</span>
              </div>
              <div class="field-row">
                <span class="field-label">Date of Joining:</span>
                <span class="field-value">${formData.dateOfJoining ? new Date(formData.dateOfJoining).toLocaleDateString('en-GB') : 'N/A'}</span>
              </div>
              <div class="field-row">
                <span class="field-label">Member Type:</span>
                <span class="field-value">${formData.memberType || 'N/A'}</span>
              </div>
              <div class="field-row">
                <span class="field-label">Branch Name:</span>
                <span class="field-value">${formData.branchName || 'N/A'}</span>
              </div>
              <div class="field-row">
                <span class="field-label">Address:</span>
                <span class="field-value">${formData.address || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div class="section" style="width: 100%;">
            <div class="section-title">Grantor and Nominee Details</div>
            <div class="section-content">
              <div class="split-row">
                <div class="split-field">
                  <span class="field-label">Grantor Name:</span>
                  <span class="field-value">${formData.grantorName || 'N/A'}</span>
                </div>
                <div class="split-field">
                  <span class="field-label">Nominee Name:</span>
                  <span class="field-value">${formData.nomineeName || 'N/A'}</span>
                </div>
              </div>
              <div class="split-row">
                <div class="split-field">
                  <span class="field-label">Grantor Address:</span>
                  <span class="field-value">${formData.grantorAddress || 'N/A'}</span>
                </div>
                <div class="split-field">
                  <span class="field-label">Nominee Address:</span>
                  <span class="field-value">${formData.nomineeAddress || 'N/A'}</span>
                </div>
              </div>
              <div class="split-row">
                <div class="split-field">
                  <span class="field-label">Grantor Mobile:</span>
                  <span class="field-value">${formData.grantorMobile || 'N/A'}</span>
                </div>
                <div class="split-field">
                  <span class="field-label">Nominee Mobile:</span>
                  <span class="field-value">${formData.nomineeMobile || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="right-section">
          <div class="photo-container">
            ${formData.photo ? `<img src="${formData.photo}" alt="Applicant Photo">` : '<div style="color: #666;">PHOTO<br>(Optional)</div>'}
          </div>
          <div class="signature-container">
            ${formData.applicantSignature ? `<img src="${formData.applicantSignature}" alt="Applicant Signature">` : '<div style="color: #666;">Signature</div>'}
          </div>
          <div class="signature-label">Applicant Signature</div>
        </div>
      </div>

      <div class="declaration">
        <div class="declaration-title">DECLARATION</div>
        <p>I myself declare that above given information is true and authenticated best of my knowledge. I am ready to pay above registration fees from myself income resources. I solemnly declare that will not return above amount to me/us. I also declare that company will pay to this money to insurance company for myself/my family health insurance premium and give to me/us a health cover. I declare that never dispute to company in case denial/rejection the loan/unit /ohg loan/health cover/home loan/cattle loan/insurance loan /education loan/marriage loan /others loan /project sanctioned by company.</p>
      </div>

      <div class="footer-signatures">
        <div class="signature-section">
          <div class="signature-box">
            ${formData.applicantSignature ? `<img src="${formData.applicantSignature}" alt="Applicant Signature">` : ''}
          </div>
          <div class="signature-line"></div>
          <div style="font-size: 10px; font-weight: bold;">Applicant Signature</div>
          <div style="font-size: 9px;">(${formData.memberName})</div>
        </div>
        
        <div class="signature-section">
          <div class="signature-box">
            ${formData.guarantorSignature ? `<img src="${formData.guarantorSignature}" alt="Guarantor Signature">` : ''}
          </div>
          <div class="signature-line"></div>
          <div style="font-size: 10px; font-weight: bold;">Guarantor Signature</div>
          <div style="font-size: 9px;">(${formData.grantorName})</div>
        </div>
        
        <div class="signature-section">
          <div class="signature-box">
            ${formData.branchSeal ? `<img src="${formData.branchSeal}" alt="Branch Seal">` : ''}
          </div>
          <div class="signature-line"></div>
          <div style="font-size: 10px; font-weight: bold;">Branch Seal with Signature</div>
          <div style="font-size: 9px;">(Authorized Signatory)</div>
        </div>
      </div>

      <div class="print-info">
        <div>Application Date & Time: ${new Date().toLocaleString('en-IN')}</div>
        <div>Reference ID: ${formData.applicationNo || 'N/A'} | OJAL MICRO SERVICE FOUNDATION</div>
      </div>
    </div>

    <!-- Page 2: Loan Agreement -->
    <div class="page">
      <div class="agreement-header">
        <div class="logo-container">
          <img src="/src/assets/ojal-logo.png" alt="OJAL Micro Finance">
        </div>
        <div class="company-info">
          <div class="company-name">OJAL MICRO SERVICE FOUNDATION</div>
          <div class="company-address">
            CIN: U88900PN2023NPL219300<br>
            Address: SN73 Adarsh Nagar, Ashtavinayak Colony, Dighi Pune -411015<br>
            Email: ojalmicroservicefoundation.obs@gmail.com | Phone: +91-7499552539
          </div>
          <div class="form-title">LOAN AGREEMENT</div>
        </div>
      </div>
      
      <div class="agreement-content">
        <p>
          <strong>This LOAN AGREEMENT "Personal Loan" Agreement executed between</strong>
        </p>
        
        <p>
          Mr./Miss/Mrs. <strong>${formData.memberName || '[Borrower Name]'}</strong> S/o <strong>${formData.fatherName || '[Father Name]'}</strong>, 
          R/O <strong>${formData.address || '[Borrower Address]'}</strong> hereinafter referred as "<strong>borrower</strong>".
        </p>
        
        <p>
          M/s <strong>OJAL MICRO SERVICE FOUNDATION</strong>, a <strong>Private Limited</strong> Company incorporated under the companies act, 2013, 
          having registered office at <strong>SN73 Adarsh Nagar, Ashtavinayak Colony, Dighi Pune -411015</strong> hereinafter referred as "<strong>Lender</strong>".
        </p>
        
        <p>
          <strong>IN CONSIDERATION OF</strong> the Lender loaning certain monies (the Loan) to the Borrower, and the Borrower repaying the Loan to the Lender, 
          the parties agree to keep, perform and fulfill the promises and conditions set out in this Agreement.
        </p>
        
        <p>
          <strong>WHEREAS</strong> the Borrower is in need of funds and hence has approached the Lender to grant her Rs. ${parseFloat(formData.loanAmount || 0).toLocaleString('en-IN')} /- 
          for a period of ${formData.tenure || '0'} Days.
        </p>

        <div class="agreement-grid">
          <div class="agreement-box">
            <div class="agreement-box-title">LOAN DETAILS</div>
            <div style="font-size: 9px; line-height: 1.4;">
              <div style="display: flex; justify-content: space-between;">
                <span>Loan Amount:</span>
                <span style="font-weight: bold;">₹${formattedLoanAmount}</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span>Processing Fee:</span>
                <span style="font-weight: bold;">₹${parseFloat(formData.processingFee || 0).toLocaleString('en-IN')}</span>
              </div>

              <div style="display: flex; justify-content: space-between;">  
                <span>Disbursed Amount:</span>
                <span style="font-weight: bold;">₹${((parseFloat(formData.loanAmount) || 0) - (parseFloat(formData.processingFee) || 0)).toLocaleString('en-IN')}</span>
              </div>

              <div style="display: flex; justify-content: space-between;">
                <span>Interest Rate:</span>
                <span style="font-weight: bold;">${formData.roi || '0'}% per annum</span>
              </div>

              <div style="display: flex; justify-content: space-between;">
                <span>Tenure:</span>
                <span style="font-weight: bold;">${formData.tenure || '0'} Days</span>
              </div>

              <div style="display: flex; justify-content: space-between;">
                <span>EMI Amount:</span>
                <span style="font-weight: bold;">₹${formattedEmiAmount}</span>
              </div>

              <div style="display: flex; justify-content: space-between;">
                <span>Total Payable:</span>
                <span style="font-weight: bold;">₹${totalPayable}</span>
              </div>

            </div>
          </div>

          <div class="agreement-box">
            <div class="agreement-box-title">BORROWER DETAILS</div>
            <div style="font-size: 9px; line-height: 1.4;">
              <div><strong>Name:</strong> ${formData.memberName || 'N/A'}</div>
              <div><strong>Father's Name:</strong> ${formData.fatherName || 'N/A'}</div>
              <div><strong>Mobile:</strong> ${formData.mobile || 'N/A'}</div>
              <div><strong>Purpose:</strong> ${formData.purposeOfLoan || 'N/A'}</div>
            </div>
          </div>
        </div>

        <div style="margin-top: 15px;">
          <div style="margin-bottom: 8px;">
            <strong>Loan Amount & Interest:</strong>
            <ol style="margin: 5px 0; padding-left: 15px;">
              <li>The Borrower hereto, requiring money, has requested the Lender to give her a with interest loan of Rs. ${parseFloat(formData.loanAmount || 0).toLocaleString('en-IN')} /-</li>
              <li>The said loan is required by the Borrower for a period of ${formData.tenure || '0'} Days</li>
              <li>The Borrower hereby agrees and undertakes to return the loan of Rs. ${parseFloat(formData.loanAmount || 0).toLocaleString('en-IN')} /- within the aforesaid period of ${formData.tenure || '0'} Days and, gives his personal guarantee for the same.</li>
              <li>The terms and conditions of this Agreement are arrived at by the mutual consent of the parties hereto.</li>
            </ol>
          </div>

          <div style="margin-bottom: 8px;">
            <strong>Payment:</strong>
            <ol style="margin: 5px 0; padding-left: 15px;">
              <li>This Loan will be repaid in full on the due date.</li>
              <li>At any time while not in default under this Agreement, the Borrower may make lump sum payments or pay the outstanding balance then owing under this agreement to the lender without further bonus or penalty.</li>
            </ol>
          </div>

          <div style="margin-bottom: 8px;">
            <strong>Default:</strong><br>
            Notwithstanding anything to the contrary in this agreement, if the Borrower defaults in the performance of any obligation under this agreement, then the lender may declare the amount owing under this Agreement at that time to be immediately due and payable.
          </div>

          <div style="margin-bottom: 8px;">
            <strong>Governing Law:</strong><br>
            This Agreement will be construed in accordance with and governed by the laws of the State.
          </div>

          <div style="margin-bottom: 8px;">
            <strong>Cost:</strong><br>
            The Borrower shall be liable for all costs, expenses and expenditures incurred including, without limitation, the complete legal costs of the lender incurred by enforcing this a result of any default by the Borrower and such costs will be added to the principal then outstanding and shall be due and payable by the Borrower to the Lender immediately upon demand of the Lender.
          </div>

          <div style="margin-bottom: 8px;">
            <strong>Binding Effect:</strong><br>
            This Agreement will pass to the benefit of and be binding upon the respective heirs, executors, administrators, successors and permitted assigns of the Borrower and Lender. The Borrower waives presentment for payment, notice of non-payment, protest, and notice of protest.
          </div>

          <div style="margin-bottom: 8px;">
            <strong>Amendments:</strong><br>
            This Agreement may only be amended or modified by a written instrument executed by both the Borrower and the Lender.
          </div>

          <div style="margin-bottom: 8px;">
            <strong>Severability:</strong><br>
            The Clauses and paragraphs contained in this agreement are intended to be read and construed independently of each other. If any term, covenant, condition or provision of this agreement id held by a court of competent jurisdiction to be invalid, void or unenforceable, it is the parties' intent that such provision be reduced in scope by the court to the extent deemed necessary by the court to render the provision reasonable and enforceable and the remainder of the provisions of this agreement will in no way be affected, i impaired or invalidated as a result.
          </div>

          <div style="margin-bottom: 8px;">
            <strong>General Provisions:</strong><br>
            Headings are inserted for the convenience of the parties only and are not to be considered when interpreting this agreement. Words in the singular mean and include the plural and vice versa. Words in the masculine mean and include the feminine and vice versa.
          </div>

          <div style="margin-bottom: 8px;">
            <strong>Entire Agreement:</strong><br>
            This agreement constitutes the entire agreement between the parties and there are no further items or provisions, either oral or otherwise.
          </div>

          <div style="margin-bottom: 8px;">
            <strong>IN WITNESS WHEREOF:</strong><br>
            The parties hereto have hereunto set and subscribed their respective hands the day and year first hereinabove written.
          </div>
        </div>

        <div class="agreement-notice">
          <strong>IMPORTANT NOTICE:</strong><br>
          By signing this agreement, the Borrower acknowledges having read, understood, and agreed to all the terms 
          and conditions mentioned herein. This agreement is legally binding and enforceable under Indian law.
        </div>

        <div class="agreement-checkbox">
          <strong>I, ${formData.memberName || '[Borrower Name]'}, hereby acknowledge that:</strong><br>
          • I have read and understood all the terms and conditions of this Loan Agreement<br>
          • I agree to comply with all the terms mentioned in this agreement<br>
          • I understand the consequences of default and agree to the penalty structure<br>
          • All information provided by me is true and accurate to the best of my knowledge<br>
          • I agree to use the loan amount solely for the stated purpose<br>
          <strong>I hereby accept this Loan Agreement and agree to be bound by its terms and conditions.</strong>
        </div>
      </div>

      <div class="footer-signatures">
        <div class="signature-section">
          <div class="signature-box">
            ${formData.applicantSignature ? `<img src="${formData.applicantSignature}" alt="Applicant Signature">` : ''}
          </div>
          <div class="signature-line"></div>
          <div style="font-size: 10px; font-weight: bold;">Borrower Signature</div>
          <div style="font-size: 9px;">(${formData.memberName})</div>
        </div>
        
        <div class="signature-section">
          <div class="signature-box">
            ${formData.guarantorSignature ? `<img src="${formData.guarantorSignature}" alt="Guarantor Signature">` : ''}
          </div>
          <div class="signature-line"></div>
          <div style="font-size: 10px; font-weight: bold;">Co-Borrower Signature</div>
          <div style="font-size: 9px;">(${formData.grantorName})</div>
        </div>
        
        <div class="signature-section">
          <div class="signature-box"></div>
          <div class="signature-line"></div>
          <div style="font-size: 10px; font-weight: bold;">For OJAL MICRO SERVICE FOUNDATION</div>
          <div style="font-size: 9px;">(Authorized Signatory)</div>
        </div>
      </div>

      <div class="print-info">
        <div>Agreement Date & Time: ${new Date().toLocaleString('en-IN')}</div>
        <div>Reference ID: ${formData.applicationNo || 'N/A'} | OJAL MICRO SERVICE FOUNDATION</div>
      </div>
    </div>

    <!-- Page 3: EMI Card -->
    <div class="page">
      <div class="header">
        <div class="logo-container">
          <img src="/src/assets/ojal-logo.png" alt="OJAL Micro Finance">
        </div>
        <div class="company-info">
          <div class="company-name">OJAL MICRO SERVICE FOUNDATION</div>
          <div class="company-address">
            CIN: U88900PN2023NPL219300<br>
            Address: SN73 Adarsh Nagar, Ashtavinayak Colony, Dighi Pune -411015<br>
            Email: ojalmicroservicefoundation.obs@gmail.com | Phone: +91-7499552539
          </div>
          <div class="form-title">LOAN EMI CARD</div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Loan Details</div>
        <div class="section-content">
          <div class="field-row">
            <span class="field-label">Branch:</span>
            <span class="field-value">OJAL MICRO SERVICE FOUNDATION</span>
          </div>
          <div class="field-row">
            <span class="field-label">Date:</span>
            <span class="field-value">${new Date().toLocaleDateString('en-GB')}</span>
          </div>
          <div class="field-row">
            <span class="field-label">Customer Name:</span>
            <span class="field-value">${formData.memberName || 'N/A'}</span>
          </div>
          <div class="field-row">
            <span class="field-label">Contact No:</span>
            <span class="field-value">${formData.mobile || 'N/A'}</span>
          </div>
          <div class="field-row">
            <span class="field-label">Loan Amount:</span>
            <span class="field-value">₹ ${parseFloat(formData.loanAmount || 0).toLocaleString('en-IN')}</span>
          </div>
          <div class="field-row">
            <span class="field-label">Processing Fee:</span>
            <span class="field-value">₹ ${parseFloat(formData.processingFee || 0).toLocaleString('en-IN')}</span>
          </div>
          <div class="field-row">
            <span class="field-label">Disbursed Amount:</span>
            <span class="field-value">₹ ${parseFloat(formData.disbursedAmount || 0).toLocaleString('en-IN')}</span>
          </div>
          <div class="field-row">
            <span class="field-label">Number of EMI:</span>
            <span class="field-value">${formData.tenure || '0'}</span>
          </div>
          <div class="field-row">
            <span class="field-label">Plan Name:</span>
            <span class="field-value">${formData.loanScheme || 'N/A'}</span>
          </div>
          <div class="field-row">
            <span class="field-label">Exit Amount:</span>
            <span class="field-value">₹ ${totalPayable}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">EMI Schedule Terms</div>
        <div class="section-content">
          <table class="emi-table">
            <thead>
              <tr>
                <th style="width: 8%">Sr No.</th>
                <th style="width: 15%">Loan EMI Date</th>
                <th style="width: 12%">Interest</th>
                <th style="width: 12%">Principal</th>
                <th style="width: 12%">Amount</th>
                <th style="width: 15%">Receiving Date</th>
                <th style="width: 12%">Received Amt</th>
                <th style="width: 7%">Staff Sign</th>
                <th style="width: 7%">Sign</th>
              </tr>
            </thead>
            <tbody>
              ${emiSchedule.map(item => `
                <tr>
                  <td>${item.sNo}</td>
                  <td>${item.date}</td>
                  <td>₹${item.interest}</td>
                  <td>₹${item.principal}</td>
                  <td>₹${item.amount}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
              `).join('')}
              ${emiSchedule.length === 0 ? '<tr><td colspan="9" style="text-align: center;">No EMI schedule available</td></tr>' : ''}
            </tbody>
          </table>
        </div>
      </div>

      <!-- signature after EMI table -->

      <div class="footer-signatures">
        <div class="signature-section">
          <div class="signature-box">
            ${formData.applicantSignature ? `<img src="${formData.applicantSignature}" alt="Applicant Signature">` : ''}
          </div>
          <div class="signature-line"></div>
          <div style="font-size: 10px; font-weight: bold;">Applicant Signature</div>
          <div style="font-size: 9px;">(${formData.memberName})</div>
        </div>
        
        <div class="signature-section">
          <div class="signature-box"></div>
          <div class="signature-line"></div>
          <div style="font-size: 10px; font-weight: bold;">For OJAL MICRO SERVICE FOUNDATION</div>
          <div style="font-size: 9px;">(Authorized Signatory)</div>
        </div>
      </div>

      <div class="print-info">
        <div>Date & Time: ${new Date().toLocaleString('en-IN')}</div>
        <div>Reference ID: ${formData.applicationNo || 'N/A'} | OJAL MICRO SERVICE FOUNDATION</div>
      </div>
    </div>
  </body>
  </html>`;

    const printWindow = window.open('', '_blank', 'width=800,height=600');

    if (printWindow) {
      // Write the content to the new window using DOM methods
      // It is important to set the document content to avoid overwriting issues.
      // printWindow.document.body.innerHTML = htmlContent;
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Use a 'load' event listener instead of a fixed timeout.
      // This ensures all assets (like images and CSS) have loaded before printing,
      // which prevents blank pages and missing content.
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    } else {
      alert('Please allow popups to generate the print window.');
    }
  };

  //------- handle submit function  ----------------//

   const handleSubmit = async (e) => {
  e.preventDefault();

  // Validate all required steps
  const step1Valid = validateStep(1);
  const step2Valid = validateStep(2);

  if (!step1Valid || !step2Valid) {
    alert('Please complete all required fields in previous steps');
    return;
  }

  if (!isAgreementChecked) {
    alert('Please agree to the loan agreement terms before submitting');
    return;
  }

  setIsSubmitting(true);

  try {
    // Prepare FormData for backend submission
    const formDataToSend = new FormData();

    // Create JSON object with non-file fields
    const jsonData = {};
    for (let key in formData) {
      if (formData[key] !== null && !['photo', 'applicantSignature', 'guarantorSignature', 'branchSeal'].includes(key)) {
        jsonData[key] = formData[key];
      }
    }

    // Append JSON data as 'formData' part (as expected by backend)
    formDataToSend.append('formData', new Blob([JSON.stringify(jsonData)], {
      type: 'application/json'
    }));

    // Convert data URLs to Blobs for files and append
    const dataUrlToBlob = (dataUrl, fileName) => {
      if (!dataUrl) return null;
      const [header, data] = dataUrl.split(',');
      const mime = header.match(/:(.*?);/)[1];
      const byteString = atob(data);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mime });
    };

    if (formData.photo) {
      const photoBlob = dataUrlToBlob(formData.photo, 'photo.jpg');
      formDataToSend.append('photo', photoBlob, 'photo.jpg');
    }
    if (formData.applicantSignature) {
      const applicantSigBlob = dataUrlToBlob(formData.applicantSignature, 'applicantSignature.jpg');
      formDataToSend.append('applicantSignature', applicantSigBlob, 'applicantSignature.jpg');
    }
    if (formData.guarantorSignature) {
      const guarantorSigBlob = dataUrlToBlob(formData.guarantorSignature, 'guarantorSignature.jpg');
      formDataToSend.append('guarantorSignature', guarantorSigBlob, 'guarantorSignature.jpg');
    }
    if (formData.branchSeal) {
      const branchSealBlob = dataUrlToBlob(formData.branchSeal, 'branchSeal.jpg');
      formDataToSend.append('branchSeal', branchSealBlob, 'branchSeal.jpg');
    }

    // Submit to backend (use your actual URL)
    const response = await fetch('http://localhost:8080/api/loans/create-loan', {
      method: 'POST',
      body: formDataToSend,
    });

    if (!response.ok) {
      throw new Error('Submission failed');
    }

    toast.success('Loan application submitted successfully!');

    // Generate and download the application PDF
    await generateStandardPDF();

    // Show success popup
    setShowSuccessPopup(true);
    console.log("form data payload :", formData);
  } catch (error) {
    console.error('Error submitting application:', error);
    toast.error('Error submitting application. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

 //---------------------------------------------------------//

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Validate all required steps
  //   const step1Valid = validateStep(1);
  //   const step2Valid = validateStep(2);

  //   if (!step1Valid || !step2Valid) {
  //     alert('Please complete all required fields in previous steps');
  //     return;
  //   }

  //   if (!isAgreementChecked) {
  //     alert('Please agree to the loan agreement terms before submitting');
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     // Simulate form submission
  //     await new Promise(resolve => setTimeout(resolve, 2000));

  //     // Generate and download the application PDF
  //     await generateStandardPDF();

  //     // Show success popup
  //     setShowSuccessPopup(true);
  //     console.log("form data payload :", formData);
  //   } catch (error) {
  //     console.error('Error submitting application:', error);
  //     alert('Error submitting application. Please try again.');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleDownloadPDF = async () => {
    try {
      await generateStandardPDF();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className='rounded-xl' >
              <div className="flex items-center mb-6">
                <Dock className="h-6 w-6 text-green-600 mr-3" />
                <h2 className="text-xl font-bold text-green-800">Loan Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Application No *</label>
                  <input
                    type="text"
                    name="applicationNo"
                    value={formData.applicationNo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Enter application number"
                  />
                  {errors.applicationNo && <p className="text-red-500 text-xs mt-1">{errors.applicationNo}</p>}
                </div> */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Purpose of Loan</label>
                  <select
                    name="purposeOfLoan"
                    value={formData.purposeOfLoan}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="Business Loan">Business Loan</option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Home Loan">Home Loan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Amount *</label>
                  <input
                    type="number"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter loan amount"
                    min="1000"
                    max="10000000"
                  />
                  {errors.loanAmount && <p className="text-red-500 text-xs mt-1">{errors.loanAmount}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">ROI (%) *</label>
                  <input
                    type="number"
                    step="0.1"
                    name="roi"
                    value={formData.roi}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter ROI"
                    min="0.1"
                    max="50"
                  />
                  {errors.roi && <p className="text-red-500 text-xs mt-1">{errors.roi}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Applied Date</label>
                  <input
                    type="date"
                    name="appliedDate"
                    value={formData.appliedDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tenure (Months) *</label>
                  <input
                    type="number"
                    name="tenure"
                    value={formData.tenure}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter tenure in months"
                    min="1"
                    max="60"
                  />
                  {errors.tenure && <p className="text-red-500 text-xs mt-1">{errors.tenure}</p>}
                </div>
              </div>

              <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3">EMI Calculation</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">EMI Amount:</span>
                    <div className="font-bold text-blue-700">₹{formData.emiAmount}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Amount:</span>
                    <div className="font-bold text-blue-700">₹{(parseFloat(formData.emiAmount || 0) * parseInt(formData.tenure || 0)).toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Interest Rate:</span>
                    <div className="font-bold text-blue-700">{formData.roi}%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Tenure:</span>
                    <div className="font-bold text-blue-700">{formData.tenure} Months</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #E1F7F5 40%, #ffffff 100%)',
            }}>
              <div className="flex items-center mb-6">
                <User className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-bold text-blue-800">Applicant Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Member No *</label>
                  <input
                    type="text"
                    name="memberNo"
                    value={formData.memberNo}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter member number"
                  />
                  {errors.memberNo && <p className="text-red-500 text-xs mt-1">{errors.memberNo}</p>}
                </div> */}

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Member Name *</label>
                  <input
                    type="text"
                    name="memberName"
                    value={formData.memberName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full name"
                  />
                  {errors.memberName && <p className="text-red-500 text-xs mt-1">{errors.memberName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Father Name *</label>
                  <input
                    type="text"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter father's name"
                  />
                  {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile No *</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter 10-digit mobile number"
                    maxLength="10"
                  />
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Joining *</label>
                  <input
                    type="date"
                    name="dateOfJoining"
                    value={formData.dateOfJoining}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {errors.dateOfJoining && <p className="text-red-500 text-xs mt-1">{errors.dateOfJoining}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Member Type</label>
                  <select
                    name="memberType"
                    value={formData.memberType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Share Holder">Share Holder</option>
                    <option value="Regular Member">Regular Member</option>
                    <option value="Associate Member">Associate Member</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Branch Name</label>
                  <input
                    type="text"
                    name="branchName"
                    value={formData.branchName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter branch name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter full address"
                    rows="3"
                  ></textarea>
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pan Number *</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Pan Number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Adhaar Number *</label>
                  <input
                    type="text"
                    name="adhaarNumber"
                    value={formData.adhaarNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Adhaar Number"
                  />
                </div>

              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center mb-6">
                <Building className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-xl font-bold text-purple-800">Grantor & Nominee Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Grantor Name *</label>
                  <input
                    type="text"
                    name="grantorName"
                    value={formData.grantorName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Grantor's Name"
                  />
                  {errors.grantorName && <p className="text-red-500 text-xs mt-1">{errors.grantorName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nominee Name *</label>
                  <input
                    type="text"
                    name="nomineeName"
                    value={formData.nomineeName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Nominee's Name"
                  />
                  {errors.nomineeName && <p className="text-red-500 text-xs mt-1">{errors.nomineeName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Grantor Address *</label>
                  <input
                    type="text"
                    name="grantorAddress"
                    value={formData.grantorAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Grantor's Address"
                  />
                  {errors.grantorAddress && <p className="text-red-500 text-xs mt-1">{errors.grantorAddress}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nominee Address *</label>
                  <input
                    type="text"
                    name="nomineeAddress"
                    value={formData.nomineeAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Nominee's Address"
                  />
                  {errors.nomineeAddress && <p className="text-red-500 text-xs mt-1">{errors.nomineeAddress}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Grantor Mobile Number *</label>
                  <input
                    type="text"
                    name="grantorMobile"
                    value={formData.grantorMobile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Grantor's Mobile Number"
                  />
                  {errors.grantorMobile && <p className="text-red-500 text-xs mt-1">{errors.grantorMobile}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nominee Mobile Number *</label>
                  <input
                    type="text"
                    name="nomineeMobile"
                    value={formData.nomineeMobile}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter Nominee's Mobile Number"
                  />
                  {errors.nomineeMobile && <p className="text-red-500 text-xs mt-1">{errors.nomineeMobile}</p>}
                </div>

              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center mb-6">
                <FileText className="h-6 w-6 text-orange-600 mr-3" />
                <h2 className="text-xl font-bold text-orange-800">Document Upload</h2>
                <span className="ml-4 text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">All documents are optional</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 bg-gray-100 rounded-full overflow-hidden border-2 border-dashed border-gray-300 mb-3">
                    {formData.photo ? (
                      <>
                        <img src={formData.photo} alt="Applicant" className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeFile('photo')}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <User className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Applicant Photo</label>
                  <input
                    type="file"
                    ref={photoInputRef}
                    onChange={(e) => handleFileUpload(e, 'photo')}
                    accept="image/*"
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm flex items-center justify-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Photo
                  </label>
                  <p className="text-xs text-gray-500 mt-2 text-center">Optional, Max 5MB</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-24 bg-gray-100 rounded-md overflow-hidden border-2 border-dashed border-gray-300 mb-3 flex items-center justify-center">
                    {formData.applicantSignature ? (
                      <>
                        <img src={formData.applicantSignature} alt="Applicant Signature" className="h-16 object-contain" />
                        <button
                          onClick={() => removeFile('applicantSignature')}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="text-gray-400">
                        <span className="text-xs">Applicant Signature</span>
                      </div>
                    )}
                  </div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Applicant Signature</label>
                  <input
                    type="file"
                    ref={applicantSigInputRef}
                    onChange={(e) => handleFileUpload(e, 'applicantSignature')}
                    accept="image/*"
                    className="hidden"
                    id="applicant-signature-upload"
                  />
                  <label
                    htmlFor="applicant-signature-upload"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm flex items-center justify-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Signature
                  </label>
                  <p className="text-xs text-gray-500 mt-2 text-center">Optional, Max 5MB</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative w-48 h-24 bg-gray-100 rounded-md overflow-hidden border-2 border-dashed border-gray-300 mb-3 flex items-center justify-center">
                    {formData.guarantorSignature ? (
                      <>
                        <img src={formData.guarantorSignature} alt="Guarantor Signature" className="h-16 object-contain" />
                        <button
                          onClick={() => removeFile('guarantorSignature')}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="text-gray-400">
                        <span className="text-xs">Guarantor Signature</span>
                      </div>
                    )}
                  </div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Guarantor Signature</label>
                  <input
                    type="file"
                    ref={guarantorSigInputRef}
                    onChange={(e) => handleFileUpload(e, 'guarantorSignature')}
                    accept="image/*"
                    className="hidden"
                    id="guarantor-signature-upload"
                  />
                  <label
                    htmlFor="guarantor-signature-upload"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm flex items-center justify-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Signature
                  </label>
                  <p className="text-xs text-gray-500 mt-2 text-center">Optional, Max 5MB</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="relative w-32 h-32 bg-gray-100 rounded-md overflow-hidden border-2 border-dashed border-gray-300 mb-3 flex items-center justify-center">
                    {formData.branchSeal ? (
                      <>
                        <img src={formData.branchSeal} alt="Branch Seal" className="max-w-full max-h-full object-contain" />
                        <button
                          onClick={() => removeFile('branchSeal')}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center">
                        <Building className="h-12 w-12" />
                        <span className="text-xs mt-1">Branch Seal</span>
                      </div>
                    )}
                  </div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">Branch Seal with Signature</label>
                  <input
                    type="file"
                    ref={branchSealInputRef}
                    onChange={(e) => handleFileUpload(e, 'branchSeal')}
                    accept="image/*"
                    className="hidden"
                    id="branch-seal-upload"
                  />
                  <label
                    htmlFor="branch-seal-upload"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm flex items-center justify-center"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Seal
                  </label>
                  <p className="text-xs text-gray-500 mt-2 text-center">Optional, Max 5MB</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-center mb-6">
                <Scale className="h-6 w-6 text-yellow-600 mr-3" />
                <h2 className="text-xl font-bold text-yellow-800">Loan Agreement</h2>
              </div>

              <LoanAgreement
                formData={formData}
                onAgree={(e) => setIsAgreementChecked(e.target.checked)}
                isAgreed={isAgreementChecked}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl p-6 border border-indigo-200">
              <div className="flex items-center mb-6">
                <CheckCircle className="h-6 w-6 text-indigo-600 mr-3" />
                <h2 className="text-xl font-bold text-indigo-800">Review & Submit</h2>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 p-6">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                    <Dock className="h-5 w-5 text-blue-500 mr-2" />
                    Loan Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex">
                      <span className="text-gray-600 w-40">Application No:</span>
                      <span className="font-medium">{formData.applicationNo}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">Applied Date:</span>
                      <span className="font-medium">{new Date(formData.appliedDate).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">Loan Amount:</span>
                      <span className="font-medium">₹{(parseFloat(formData.loanAmount) || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">Processing Fee:</span>
                      <span className="font-medium">₹{formData.processingFee}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">Interest Rate:</span>
                      <span className="font-medium">{formData.roi}%</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">Tenure:</span>
                      <span className="font-medium">{formData.tenure} Months</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">EMI Amount:</span>
                      <span className="font-medium">₹{formData.emiAmount}</span>
                    </div>


                    <div className="flex">
                      <span className="text-gray-600 w-40">Disbursed Amount:</span>
                      <span className="font-medium">₹{((parseFloat(formData.loanAmount) || 0) - (parseFloat(formData.processingFee) || 0)).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 p-6">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                    <User className="h-5 w-5 text-blue-500 mr-2" />
                    Applicant Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex">
                      <span className="text-gray-600 w-40">Member Name:</span>
                      <span className="font-medium">{formData.memberName}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">Father Name:</span>
                      <span className="font-medium">{formData.fatherName}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">Mobile No:</span>
                      <span className="font-medium">{formData.mobile}</span>
                    </div>
                    
                    <div className="flex">
                      <span className="text-gray-600 w-40">Date of Joining:</span>
                      <span className="font-medium">{new Date(formData.dateOfJoining).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">Branch Name:</span>
                      <span className="font-medium">{formData.branchName}</span>
                    </div>
                    <div className="md:col-span-2 flex">
                      <span className="text-gray-600 w-40">Address:</span>
                      <span className="font-medium flex-1">{formData.address}</span>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 p-6">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                    <Building className="h-5 w-5 text-blue-500 mr-2" />
                    Guarantor & Nominee
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex">
                      <span className="text-gray-600 w-40">Grantor Name:</span>
                      <span className="font-medium">{formData.grantorName}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">Nominee Name:</span>
                      <span className="font-medium">{formData.nomineeName}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">Grantor Address:</span>
                      <span className="font-medium">{formData.grantorAddress}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">Nominee Address:</span>
                      <span className="font-medium">{formData.nomineeAddress}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">Grantor Mobile:</span>
                      <span className="font-medium">{formData.grantorMobile}</span>
                    </div>
                    <div className="flex">
                      <span className="text-gray-600 w-40">Nominee Mobile:</span>
                      <span className="font-medium">{formData.nomineeMobile}</span>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 p-6">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                    <Scale className="h-5 w-5 text-blue-500 mr-2" />
                    Agreement Status
                  </h3>
                  <div className="flex items-center">
                    <CheckCircle className={`h-5 w-5 mr-2 ${isAgreementChecked ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`font-medium ${isAgreementChecked ? 'text-green-700' : 'text-gray-500'}`}>
                      {isAgreementChecked ? 'Loan Agreement Accepted' : 'Loan Agreement Not Accepted'}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4 flex items-center">
                    <FileText className="h-5 w-5 text-blue-500 mr-2" />
                    Documents
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden mb-2">
                        {formData.photo ? (
                          <img src={formData.photo} alt="Applicant" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <User className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium">Photo</span>
                      <span className={`text-xs ${formData.photo ? 'text-green-600' : 'text-gray-600'}`}>
                        {formData.photo ? 'Uploaded' : 'Optional'}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-12 bg-gray-100 rounded-md overflow-hidden mb-2 flex items-center justify-center">
                        {formData.applicantSignature ? (
                          <img src={formData.applicantSignature} alt="Applicant Signature" className="h-8 object-contain" />
                        ) : (
                          <div className="text-gray-400 text-xs">Signature</div>
                        )}
                      </div>
                      <span className="text-sm font-medium">Applicant Signature</span>
                      <span className={`text-xs ${formData.applicantSignature ? 'text-green-600' : 'text-gray-600'}`}>
                        {formData.applicantSignature ? 'Uploaded' : 'Optional'}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-24 h-12 bg-gray-100 rounded-md overflow-hidden mb-2 flex items-center justify-center">
                        {formData.guarantorSignature ? (
                          <img src={formData.guarantorSignature} alt="Guarantor Signature" className="h-8 object-contain'}" />
                        ) : (
                          <div className="text-gray-400 text-xs">Signature</div>
                        )}
                      </div>
                      <span className="text-sm font-medium">Guarantor Signature</span>
                      <span className={`text-xs ${formData.guarantorSignature ? 'text-green-600' : 'text-gray-600'}`}>
                        {formData.guarantorSignature ? 'Uploaded' : 'Optional'}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden mb-2 flex items-center justify-center">
                        {formData.branchSeal ? (
                          <img src={formData.branchSeal} alt="Branch Seal" className="max-w-full max-h-full object-contain" />
                        ) : (
                          <div className="text-gray-400">
                            <Building className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium">Branch Seal</span>
                      <span className={`text-xs ${formData.branchSeal ? 'text-green-600' : 'text-gray-600'}`}>
                        {formData.branchSeal ? 'Uploaded' : 'Optional'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 p-4 bg-gray-50">
                  <h3 className="font-semibold text-gray-800">EMI Schedule Preview (First 5 Installments)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Principal</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total EMI</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {generateEMISchedule().slice(0, 5).map((emi, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{emi.sNo}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{emi.date}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">₹{emi.principal}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">₹{emi.interest}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">₹{emi.amount}</td>
                        </tr>
                      ))}
                      {generateEMISchedule().length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-4 py-2 text-center text-sm text-gray-900">
                            No EMI schedule available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  Download PDF
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center disabled:bg-green-400"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  {!isSubmitting && <Download className="h-5 w-5 ml-2" />}
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {showSuccessPopup && <SuccessPopup onClose={() => setShowSuccessPopup(false)} />}

      <div className="flex items-center text-sm text-gray-600 mb-8">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />}
            <a
              href={crumb.href}
              className={`flex items-center ${crumb.current ? 'text-blue-600 font-medium' : 'hover:text-blue-500'}`}
            >
              {crumb.icon && <crumb.icon className="h-4 w-4 mr-1" />}
              {crumb.label}
            </a>
          </React.Fragment>
        ))}
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Loan Application Form</h1>
        <p className="text-gray-600">Please fill in all the required details to apply for a loan</p>
      </div>

      <div className="mb-8">
        <div className="flex justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200 z-0">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>

          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center z-10">
              <button
                onClick={() => goToStep(step.id)}
                disabled={step.id > currentStep && !completedSteps.includes(step.id - 1)}
                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step.id ? 'bg-blue-600 text-white' : completedSteps.includes(step.id) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'} transition-colors`}
              >
                {currentStep > step.id || completedSteps.includes(step.id) ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <step.icon className="h-4 w-4" />
                )}
              </button>
              <span className={`mt-2 text-sm font-medium ${currentStep === step.id ? 'text-blue-600' : 'text-gray-600'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        style={{ background: 'linear-gradient(135deg, #ffffff 0%, #E1F7F5 40%, #ffffff 100%)' }}>
        {renderStep()}

        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg flex items-center ${currentStep === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Previous
          </button>

          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              Next
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          ) : (
            // Submit button is now inside the form and in the renderStep function
            <div></div>
          )}
        </div>
      </form>

      {/* Toast container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default LoanApplicationForm;
