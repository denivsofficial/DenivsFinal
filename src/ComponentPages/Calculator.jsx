import React, { useState, useMemo } from 'react';
import { Calculator as CalculatorIcon, Wallet, X } from 'lucide-react';

// --- Helper Functions ---
const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
const formatLakh = (val) => {
  if (val >= 10000000) return `(${(val / 10000000).toFixed(2)} Cr)`;
  if (val >= 100000) return `(${(val / 100000).toFixed(2)} L)`;
  return `(${new Intl.NumberFormat('en-IN').format(val)})`;
};

// --- Shadcn-inspired Minimal Slider ---
const RangeInput = ({ label, min, max, step = 1, value, onChange, unit = "", isCurrency = false }) => (
  <div className="space-y-3 mb-6">
    <div className="flex justify-between items-center">
      <label className="text-sm font-medium leading-none text-slate-700">{label}</label>
      <span className="text-sm font-semibold text-slate-900">
        {isCurrency ? `${formatCurrency(value)} ${formatLakh(value)}` : `${value} ${unit}`}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-all"
    />
  </div>
);

const Calculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('emi'); // 'emi' or 'affordability'

  // --- EMI State ---
  const [loanAmount, setLoanAmount] = useState(3000000); // 30L Default
  const [interestRate, setInterestRate] = useState(9);
  const [tenure, setTenure] = useState(60); // Updated default to fit 12-84 range

  // --- Affordability State ---
  const [income, setIncome] = useState(100000);
  const [existingEmi, setExistingEmi] = useState(20000);
  const [downPayment, setDownPayment] = useState(1000000);

  // --- Math Logic: EMI ---
  const emiResults = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenure;
    
    const emi = r === 0 ? P / n : Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;

    return { emi, totalPayment, totalInterest };
  }, [loanAmount, interestRate, tenure]);

  // --- Math Logic: Affordability ---
  const affordResults = useMemo(() => {
    const maxAffordableEmi = Math.max(0, (income * 0.5) - existingEmi);
    const r = interestRate / 12 / 100;
    const n = tenure;

    const eligibleLoan = r === 0 ? maxAffordableEmi * n : Math.round(maxAffordableEmi / ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)));
    const affordableProperty = eligibleLoan + downPayment;

    return { eligibleLoan, affordableProperty };
  }, [income, existingEmi, interestRate, tenure, downPayment]);

  return (
    <div className="w-full relative">
      {/* --- ENTRY TRIGGERS --- */}
      <div className="flex flex-row justify-center gap-4 w-max h-full items-center mx-auto py-8">
        <button 
          onClick={() => { setActiveTab('emi'); setIsOpen(true); }}
          className="flex flex-col items-center justify-center rounded-xl p-6 w-[180px] bg-white border border-slate-200 text-slate-900 shadow-sm hover:bg-slate-50 transition-all duration-200"
        >
          <CalculatorIcon className="w-6 h-6 mb-3 text-slate-700" />
          <span className="text-sm font-medium">EMI Calculator</span>
        </button>

        <button 
          onClick={() => { setActiveTab('affordability'); setIsOpen(true); }}
          className="flex flex-col items-center justify-center rounded-xl p-6 w-[180px] bg-white border border-slate-200 text-slate-900 shadow-sm hover:bg-slate-50 transition-all duration-200"
        >
          <Wallet className="w-6 h-6 mb-3 text-slate-700" />
          <span className="text-sm font-medium">Affordability</span>
        </button>
      </div>

      {/* --- MODAL OVERLAY --- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
            
            {/* Header */}
            <div className="flex justify-between items-center p-6 pb-4">
              <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Financial Planner</h2>
              <button 
                onClick={() => setIsOpen(false)} 
                className="rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
              >
                <X className="h-4 w-4 text-slate-500" />
              </button>
            </div>

            <div className="px-6">
              {/* Shadcn-style Tabs */}
              <div className="inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-500 w-full mb-6">
                <button 
                  onClick={() => setActiveTab('emi')}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all w-1/2 ${activeTab === 'emi' ? 'bg-white text-slate-950 shadow-sm' : 'hover:bg-slate-200/50 hover:text-slate-900'}`}
                >
                  EMI Calculator
                </button>
                <button 
                  onClick={() => setActiveTab('affordability')}
                  className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all w-1/2 ${activeTab === 'affordability' ? 'bg-white text-slate-950 shadow-sm' : 'hover:bg-slate-200/50 hover:text-slate-900'}`}
                >
                  Affordability
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 pt-0 max-h-[70vh] overflow-y-auto no-scrollbar">
              
              {/* --- EMI TAB --- */}
              {activeTab === 'emi' && (
                <div className="space-y-4 animate-in slide-in-from-right-4 fade-in duration-300">
                  <RangeInput label="Loan Amount" min={1500000} max={30000000} step={100000} value={loanAmount} onChange={setLoanAmount} isCurrency />
                  <RangeInput label="Interest Rate (% p.a.)" min={5} max={15} step={0.1} value={interestRate} onChange={setInterestRate} unit="%" />
                  <RangeInput label="Tenure (Months)" min={12} max={84} step={1} value={tenure} onChange={setTenure} unit="months" />

                  {/* Minimal Results Card */}
                  <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <div className="flex flex-col items-center justify-center text-center mb-6">
                      <span className="text-xs font-medium uppercase tracking-wider text-slate-500 mb-2">Monthly EMI</span>
                      <span className="text-3xl font-bold tracking-tight text-slate-900">{formatCurrency(emiResults.emi)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-slate-200 pt-4 px-2">
                      <div className="text-center">
                        <span className="block text-[10px] font-medium uppercase text-slate-500 mb-1">Total Interest</span>
                        <span className="text-sm font-semibold text-slate-700">{formatLakh(emiResults.totalInterest)}</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-[10px] font-medium uppercase text-slate-500 mb-1">Total Payment</span>
                        <span className="text-sm font-semibold text-slate-700">{formatLakh(emiResults.totalPayment)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- AFFORDABILITY TAB --- */}
              {activeTab === 'affordability' && (
                <div className="space-y-4 animate-in slide-in-from-left-4 fade-in duration-300">
                  <RangeInput label="Monthly Income" min={20000} max={1000000} step={5000} value={income} onChange={setIncome} isCurrency />
                  <RangeInput label="Existing EMIs / Liabilities" min={0} max={200000} step={5000} value={existingEmi} onChange={setExistingEmi} isCurrency />
                  <RangeInput label="Interest Rate (% p.a.)" min={5} max={15} step={0.1} value={interestRate} onChange={setInterestRate} unit="%" />
                  <RangeInput label="Tenure (Months)" min={12} max={84} step={1} value={tenure} onChange={setTenure} unit="months" />
                  <RangeInput label="Down Payment" min={0} max={20000000} step={100000} value={downPayment} onChange={setDownPayment} isCurrency />

                  {/* Minimal Results Card */}
                  <div className="mt-8 space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-5 flex justify-between items-center shadow-sm">
                      <span className="text-xs font-medium uppercase tracking-wider text-slate-500">Eligible Loan</span>
                      <span className="text-lg font-bold text-slate-900">{formatLakh(affordResults.eligibleLoan)}</span>
                    </div>
                    
                    <div className="rounded-xl border border-transparent bg-slate-900 text-slate-50 p-6 flex flex-col items-center justify-center text-center shadow-md">
                      <span className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">Affordable Property Value</span>
                      <span className="text-2xl font-bold tracking-tight">{formatCurrency(affordResults.affordableProperty)}</span>
                      <span className="text-sm text-slate-300 mt-1">{formatLakh(affordResults.affordableProperty)}</span>
                    </div>

                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 h-10 px-4 py-2 w-full mt-2">
                      Show Matching Properties
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;