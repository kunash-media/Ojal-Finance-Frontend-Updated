// import React, { useState } from 'react';
// import { FileText, Download, User, Building, DollarSign, Calendar, FileSignature } from 'lucide-react';

// const LoanAgreementGenerator = () => {
//   const [formData, setFormData] = useState({
//     // Lender Information
//     lenderName: 'OJAL MICRO FINANCE',
//     lenderCin: 'CIN: U88900PN2023NPL219300',
//     lenderEmail: 'support@ojalmicrofoundation.in',
//     lenderAddress: 'SN73 Adarsh Nagar, Ashtavinayak Colony, Dighi Pune -411015',
    
//     // Borrower Information
//     borrowerName: '',
//     borrowerFatherName: '',
//     borrowerAddress: '',
    
//     // Loan Details
//     loanAmount: '',
//     interestRate: '',
//     loanPeriod: '',
//     loanPurpose: '',
    
//     // Agreement Details
//     agreementDate: new Date().toISOString().split('T')[0],
//     repaymentDate: '',
    
//     // Co-borrowers
//     coBorrower1: '',
//     coBorrower2: ''
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const generatePDF = () => {
//     // Create a new window with the loan agreement content for printing/PDF
//     const printWindow = window.open('', '_blank');
//     const agreementHTML = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <title>Loan Agreement</title>
//         <style>
//           body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.4; }
//           .header { text-align: center; margin-bottom: 30px; }
//           .company-logo { font-size: 24px; font-weight: bold; color: #2c5aa0; }
//           .company-info { font-size: 12px; margin: 5px 0; }
//           .title { font-size: 18px; font-weight: bold; text-decoration: underline; margin: 20px 0; }
//           .section { margin: 20px 0; }
//           .section-title { font-weight: bold; margin: 15px 0 10px 0; }
//           .amount-box { border: 1px solid #000; padding: 10px; display: inline-block; margin: 5px 0; }
//           .signature-section { margin-top: 50px; display: flex; justify-content: space-between; }
//           .signature-box { text-align: center; width: 200px; }
//           .signature-line { border-top: 1px solid #000; margin-top: 50px; padding-top: 5px; }
//           .terms { font-size: 12px; }
//           .page-break { page-break-after: always; }
//         </style>
//       </head>
//       <body>
//         <div class="header">
//           <div class="company-logo">${formData.lenderName}</div>
//           <div class="company-info">${formData.lenderCin}</div>
//           <div class="company-info">Email: ${formData.lenderEmail}</div>
//           <div class="company-info">Address: ${formData.lenderAddress}</div>
//         </div>

//         <div class="title">LOAN AGREEMENT</div>

//         <div class="section">
//           <p>This LOAN AGREEMENT "Personal Loan" Agreement executed between</p>
//           <p><strong>Mr./Mrs. ${formData.borrowerName} S/o ${formData.borrowerFatherName}</strong></p>
//           <p>Address: ${formData.borrowerAddress} hereinafter referred as "borrower".</p>
//           <p><strong>And</strong></p>
//           <p><strong>${formData.lenderName}</strong>, a Private Limited Company incorporated under the companies act, 2013, having registered office at ${formData.lenderAddress} hereinafter referred as "Lender".</p>
//         </div>

//         <div class="section">
//           <p><strong>IN CONSIDERATION</strong> of the Lender loaning certain monies (the Loan) to the Borrower, and the Borrower repaying the Loan to the Lender, the parties agree to keep, perform and fulfill the promises and conditions set out in this Agreement.</p>
//         </div>

//         <div class="section">
//           <p><strong>WHEREAS</strong> the Borrower is in need of funds and hence has approached the Lender to grant her loan of <span class="amount-box">Rs. ${formData.loanAmount}</span> for a period of <span class="amount-box">${formData.loanPeriod} Days</span>.</p>
//         </div>

//         <div class="section-title">Loan Amount & Interest:</div>
//         <div class="terms">
//           <p>1. The Borrower herein, requiring money, has requested the Lender to give her a with interest loan of <strong>Rs. ${formData.loanAmount}</strong>.</p>
//           <p>2. The said loan is required by the Borrower for a period of <strong>${formData.loanPeriod} Days</strong></p>
//           <p>3. The Borrower hereby agrees and undertakes to return the loan of <strong>Rs. ${formData.loanAmount}</strong> within the aforesaid period of <strong>${formData.loanPeriod} Days</strong> and, gives his personal guarantee for the same.</p>
//           <p>4. The terms and conditions of this Agreement are arrived at by the mutual consent of the parties hereto.</p>
//         </div>

//         <div class="page-break"></div>

//         <div class="section-title">Payment:</div>
//         <div class="terms">
//           <p>1. This Loan will be repaid in full on ${formData.repaymentDate}.</p>
//           <p>2. At any time while not in default under this Agreement, the Borrower may make lump sum payments or pay the outstanding balance then owing under this agreement to the lender without further bonus or penalty.</p>
//         </div>

//         <div class="section-title">Default:</div>
//         <div class="terms">
//           <p>3. Notwithstanding anything to the contrary in this agreement, if the Borrower defaults in the performance of any obligation under this agreement, then the lender may declare the principal amount owing under this Agreement at that time to be immediately due and payable.</p>
//         </div>

//         <div class="section-title">Governing Law:</div>
//         <div class="terms">
//           <p>4. This Agreement will be construed in accordance with and governed by the laws of the State.</p>
//         </div>

//         <div class="section-title">Cost:</div>
//         <div class="terms">
//           <p>5. The Borrower shall be liable for all costs, expenses and expenditures incurred including, without limitation, the complete legal costs of the lender incurred by enforcing this agreement as a result of any default by the Borrower and such costs will be added to the principal then outstanding and shall be due and payable by the Borrower to the Lender immediately upon demand of the Lender.</p>
//         </div>

//         <div class="section-title">Binding Effect:</div>
//         <div class="terms">
//           <p>6. This Agreement will pass to the benefit of and be binding upon the respective heirs, executors, administrators, successors and permitted assigns of the Borrower and Lender. The Borrower waives presentment for payment, notice of non-payment, protest, and notice of protest.</p>
//         </div>

//         <div class="signature-section">
//           <div class="signature-box">
//             <div class="signature-line">Borrower</div>
//             <p>Name: ${formData.borrowerName}</p>
//           </div>
//           ${formData.coBorrower1 ? `<div class="signature-box"><div class="signature-line">Co-Borrower 1</div><p>Name: ${formData.coBorrower1}</p></div>` : ''}
//           ${formData.coBorrower2 ? `<div class="signature-box"><div class="signature-line">Co-Borrower 2</div><p>Name: ${formData.coBorrower2}</p></div>` : ''}
//         </div>

//         <div style="margin-top: 50px; text-align: center;">
//           <div style="border: 2px solid #000; width: 150px; height: 150px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
//             <div>
//               <div style="border: 1px solid #000; border-radius: 50%; width: 80px; height: 80px; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
//                 SEAL
//               </div>
//               <div style="margin-top: 10px; font-size: 10px;">FOR OJAL MICRO FINANCE</div>
//             </div>
//           </div>
//           <div style="margin-top: 10px; font-size: 12px;">
//             <div>(Signature) Name of Authorised Signatory</div>
//             <div>Designation:</div>
//           </div>
//         </div>

//         <div style="margin-top: 30px; font-size: 10px;">
//           <p><strong>General Provisions:</strong></p>
//           <p>7. This Agreement may only be amended or modified by written instrument executed by both the Borrower and the Lender.</p>
//           <p>8. The Clauses and paragraphs contained in this agreement are intended to be read and construed independently of each other. If any term, condition or provision of this agreement is held by a court of competent jurisdiction to be invalid, void or unenforceable, it is the parties' intent that such provisions be reduced in scope by the court to the extent deemed necessary by the court to render the provision reasonable and enforceable and the remainder of the provisions of this agreement will in no way be affected, impaired or invalidated as a result.</p>
//           <p>9. Headings are inserted for the convenience of the parties only and are not to be considered when interpreting this agreement. Words in the singular mean and include the plural and vice versa. Words in the masculine mean and include the feminine and vice versa.</p>
//           <p>10. This agreement constitutes the entire agreement between the parties and there are no further items or provisions, either oral or otherwise.</p>
//         </div>
//       </body>
//       </html>
//     `;

//     printWindow.document.write(agreementHTML);
//     printWindow.document.close();
//     printWindow.focus();
    
//     // Trigger print dialog
//     setTimeout(() => {
//       printWindow.print();
//     }, 500);
//   };

//   const isFormValid = () => {
//     return formData.borrowerName && formData.borrowerFatherName && 
//            formData.borrowerAddress && formData.loanAmount && 
//            formData.loanPeriod && formData.repaymentDate;
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
//       <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8 text-center">
//           <div className="flex items-center justify-center mb-4">
//             <FileText size={48} className="mr-3" />
//             <h1 className="text-4xl font-bold">Loan Agreement Generator</h1>
//           </div>
//           <p className="text-blue-100 text-lg">Create professional loan agreements with PDF download</p>
//         </div>

//         <div className="p-8">
//           {/* Lender Information */}
//           <div className="mb-8 p-6 bg-gray-50 rounded-xl border-l-4 border-blue-500">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//               <Building className="mr-2 text-blue-600" size={24} />
//               Lender Information
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
//                 <input
//                   type="text"
//                   name="lenderName"
//                   value={formData.lenderName}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">CIN Number</label>
//                 <input
//                   type="text"
//                   name="lenderCin"
//                   value={formData.lenderCin}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
//                 <input
//                   type="email"
//                   name="lenderEmail"
//                   value={formData.lenderEmail}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
//                 <textarea
//                   name="lenderAddress"
//                   value={formData.lenderAddress}
//                   onChange={handleInputChange}
//                   rows="2"
//                   className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors resize-none"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Borrower Information */}
//           <div className="mb-8 p-6 bg-gray-50 rounded-xl border-l-4 border-green-500">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//               <User className="mr-2 text-green-600" size={24} />
//               Borrower Information
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Borrower Name *</label>
//                 <input
//                   type="text"
//                   name="borrowerName"
//                   value={formData.borrowerName}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
//                   placeholder="Enter borrower's full name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Father's Name *</label>
//                 <input
//                   type="text"
//                   name="borrowerFatherName"
//                   value={formData.borrowerFatherName}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
//                   placeholder="Enter father's name"
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
//                 <textarea
//                   name="borrowerAddress"
//                   value={formData.borrowerAddress}
//                   onChange={handleInputChange}
//                   rows="3"
//                   className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors resize-none"
//                   placeholder="Enter complete address"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Loan Details */}
//           <div className="mb-8 p-6 bg-gray-50 rounded-xl border-l-4 border-purple-500">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//               <DollarSign className="mr-2 text-purple-600" size={24} />
//               Loan Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount (₹) *</label>
//                 <input
//                   type="number"
//                   name="loanAmount"
//                   value={formData.loanAmount}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
//                   placeholder="25000"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
//                 <input
//                   type="number"
//                   step="0.1"
//                   name="interestRate"
//                   value={formData.interestRate}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
//                   placeholder="12.5"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Loan Period (Days) *</label>
//                 <input
//                   type="number"
//                   name="loanPeriod"
//                   value={formData.loanPeriod}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
//                   placeholder="60"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Loan Purpose</label>
//                 <input
//                   type="text"
//                   name="loanPurpose"
//                   value={formData.loanPurpose}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
//                   placeholder="Business expansion, personal use, etc."
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Agreement Details */}
//           <div className="mb-8 p-6 bg-gray-50 rounded-xl border-l-4 border-orange-500">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//               <Calendar className="mr-2 text-orange-600" size={24} />
//               Agreement Details
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Agreement Date</label>
//                 <input
//                   type="date"
//                   name="agreementDate"
//                   value={formData.agreementDate}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Repayment Date *</label>
//                 <input
//                   type="date"
//                   name="repaymentDate"
//                   value={formData.repaymentDate}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Co-borrowers */}
//           <div className="mb-8 p-6 bg-gray-50 rounded-xl border-l-4 border-indigo-500">
//             <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
//               <FileSignature className="mr-2 text-indigo-600" size={24} />
//               Co-borrowers (Optional)
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Co-borrower 1</label>
//                 <input
//                   type="text"
//                   name="coBorrower1"
//                   value={formData.coBorrower1}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
//                   placeholder="Enter co-borrower name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Co-borrower 2</label>
//                 <input
//                   type="text"
//                   name="coBorrower2"
//                   value={formData.coBorrower2}
//                   onChange={handleInputChange}
//                   className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
//                   placeholder="Enter co-borrower name"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Generate Button */}
//           <div className="text-center">
//             <button
//               onClick={generatePDF}
//               disabled={!isFormValid()}
//               className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center mx-auto space-x-3 ${
//                 isFormValid()
//                   ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg hover:shadow-xl'
//                   : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//               }`}
//             >
//               <Download size={24} />
//               <span>Generate & Download PDF</span>
//             </button>
//             {!isFormValid() && (
//               <p className="text-red-500 text-sm mt-2">Please fill in all required fields marked with *</p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoanAgreementGenerator;