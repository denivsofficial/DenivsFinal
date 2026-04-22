import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, Wallet, X, ArrowRight, Info } from 'lucide-react';

// ─── Formatters ──────────────────────────────────────────────────────────────

const fmt = (v) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(v);

const fmtL = (v) => {
  if (v >= 10000000) return `${(v / 10000000).toFixed(2)} Cr`;
  if (v >= 100000) return `${(v / 100000).toFixed(2)} L`;
  return `₹${new Intl.NumberFormat('en-IN').format(Math.round(v))}`;
};

// ─── Slider ──────────────────────────────────────────────────────────────────

const RangeInput = ({ label, hint, min, max, step = 1, value, onChange, unit = '', isCurrency = false }) => (
  <div className="mb-5">
    <div className="flex justify-between items-start mb-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
        {hint && (
          <span className="group relative cursor-help">
            <Info className="w-3 h-3 text-slate-300" />
            <span className="absolute bottom-5 left-0 w-52 text-[11px] bg-slate-800 text-white rounded-lg px-2.5 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 leading-relaxed shadow-xl">
              {hint}
            </span>
          </span>
        )}
      </div>
      <span className="text-sm font-bold text-[#001A33]">
        {isCurrency ? fmtL(value) : `${value}${unit}`}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#001A33]"
    />
    <div className="flex justify-between mt-1">
      <span className="text-[10px] text-slate-300">{isCurrency ? fmtL(min) : `${min}${unit}`}</span>
      <span className="text-[10px] text-slate-300">{isCurrency ? fmtL(max) : `${max}${unit}`}</span>
    </div>
  </div>
);

// ─── Stat row ────────────────────────────────────────────────────────────────

const StatRow = ({ label, value, highlight = false, small = false, muted = false }) => (
  <div className={`flex justify-between items-center py-2 border-b border-slate-100 last:border-0`}>
    <span className={`${small ? 'text-[11px]' : 'text-xs'} ${muted ? 'text-slate-300' : 'text-slate-500'}`}>{label}</span>
    <span className={`${small ? 'text-xs' : 'text-sm'} font-semibold ${highlight ? 'text-[#001A33] text-base font-bold' : muted ? 'text-slate-300' : 'text-slate-700'}`}>{value}</span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const FinancialCalculator = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('emi');

  // ── EMI state ──────────────────────────────────────────────────────────────
  const [loanAmount, setLoanAmount]         = useState(5000000);
  const [emiRate, setEmiRate]               = useState(8.5);
  const [emiTenureYears, setEmiTenureYears] = useState(20);

  // ── Affordability state ────────────────────────────────────────────────────
  const [grossIncome, setGrossIncome]             = useState(100000);
  const [existingEmi, setExistingEmi]             = useState(0);
  const [affordRate, setAffordRate]               = useState(8.5);
  const [affordTenureYears, setAffordTenureYears] = useState(20);
  const [downPayment, setDownPayment]             = useState(1000000);
  const [foirPct, setFoirPct]                     = useState(50);

  // ── EMI calculation ────────────────────────────────────────────────────────
  // Standard reducing-balance formula: EMI = P·r·(1+r)^n / ((1+r)^n − 1)
  const emiCalc = useMemo(() => {
    const P = loanAmount;
    const r = emiRate / 12 / 100;
    const n = emiTenureYears * 12;
    if (r === 0) {
      const emi = Math.round(P / n);
      return { emi, totalPayment: P, totalInterest: 0, principalPct: 100, interestPct: 0 };
    }
    const pow = Math.pow(1 + r, n);
    const emi = Math.round((P * r * pow) / (pow - 1));
    const totalPayment = emi * n;
    const totalInterest = totalPayment - P;
    return {
      emi,
      totalPayment,
      totalInterest,
      principalPct: Math.round((P / totalPayment) * 100),
      interestPct: Math.round((totalInterest / totalPayment) * 100),
    };
  }, [loanAmount, emiRate, emiTenureYears]);

  // ── Affordability calculation (RBI FOIR method) ────────────────────────────
  //
  // Step 1 — Max home loan EMI = (gross income × FOIR%) − existing EMIs
  // Step 2 — Eligible loan = back-calculate from that EMI
  //          Loan = EMI × ((1+r)^n − 1) / (r · (1+r)^n)
  // Step 3 — Property from down payment = loan + down payment
  // Step 4 — LTV cap: banks lend max 80% of property value
  //          → max property via LTV = loan / 0.80
  // Step 5 — Binding constraint = min(step 3, step 4)
  const affordCalc = useMemo(() => {
    const r = affordRate / 12 / 100;
    const n = affordTenureYears * 12;
    const LTV = 0.80;

    const maxEmi = Math.max(0, (grossIncome * foirPct) / 100 - existingEmi);

    let eligibleLoan = 0;
    if (maxEmi > 0) {
      if (r === 0) {
        eligibleLoan = Math.round(maxEmi * n);
      } else {
        const pow = Math.pow(1 + r, n);
        eligibleLoan = Math.round(maxEmi * ((pow - 1) / (r * pow)));
      }
    }

    const propertyFromDP  = eligibleLoan + downPayment;
    const propertyFromLtv = eligibleLoan > 0 ? Math.round(eligibleLoan / LTV) : 0;

    const ltvBinding = propertyFromLtv < propertyFromDP;
    const affordableProperty = Math.min(propertyFromDP, propertyFromLtv);

    const finalLoan        = Math.round(Math.min(eligibleLoan, affordableProperty * LTV));
    const finalDownPayment = affordableProperty - finalLoan;

    let emiOnFinalLoan = 0;
    if (finalLoan > 0 && r > 0) {
      const pow = Math.pow(1 + r, n);
      emiOnFinalLoan = Math.round((finalLoan * r * pow) / (pow - 1));
    } else if (finalLoan > 0) {
      emiOnFinalLoan = Math.round(finalLoan / n);
    }

    return { maxEmi, eligibleLoan: finalLoan, affordableProperty, finalDownPayment, emiOnFinalLoan, ltvBinding };
  }, [grossIncome, existingEmi, affordRate, affordTenureYears, downPayment, foirPct]);

  const handleClose = () => setIsOpen(false);

  const handleSearchProperties = () => {
    handleClose();
    navigate(`/properties?maxPrice=${affordCalc.affordableProperty}&status=Available`);
  };

  return (
    <>
      {/* ── Entry triggers ─────────────────────────────────────────────────── */}
      <div className="flex gap-3 justify-center py-8 flex-wrap">
        <button
          onClick={() => { setActiveTab('emi'); setIsOpen(true); }}
          className="flex flex-col items-center gap-1.5 p-5 w-44 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
        >
          <Calculator className="w-5 h-5 text-slate-500" />
          <span className="text-sm font-bold text-slate-800">EMI calculator</span>
          <span className="text-[11px] text-slate-400 text-center">How much will I pay monthly?</span>
        </button>

        <button
          onClick={() => { setActiveTab('affordability'); setIsOpen(true); }}
          className="flex flex-col items-center gap-1.5 p-5 w-44 bg-[#001A33] rounded-2xl hover:bg-[#002a52] transition-all shadow-md"
        >
          <Wallet className="w-5 h-5 text-blue-300" />
          <span className="text-sm font-bold text-white">Affordability</span>
          <span className="text-[11px] text-blue-300 text-center">What can I afford?</span>
        </button>
      </div>

      {/* ── Modal ──────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/50 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh]">

            {/* Drag handle — mobile only */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
              <div className="w-10 h-1 bg-slate-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-4 pb-3 shrink-0">
              <div>
                <h2 className="text-base font-bold text-slate-900">Financial planner</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Bank-standard FOIR method</p>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 pb-4 shrink-0">
              <div className="flex bg-slate-100 rounded-xl p-1">
                {[
                  { id: 'emi', label: 'EMI calculator' },
                  { id: 'affordability', label: 'Affordability' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-[#001A33] shadow-sm'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-6 pb-6">

              {/* ══════ EMI TAB ══════ */}
              {activeTab === 'emi' && (
                <div>
                  <RangeInput
                    label="Loan amount"
                    min={500000} max={50000000} step={100000}
                    value={loanAmount} onChange={setLoanAmount} isCurrency
                  />
                  <RangeInput
                    label="Interest rate"
                    hint="Home loan rates in India typically range 8–10% p.a. Check with your bank for the current rate."
                    min={6} max={15} step={0.05}
                    value={emiRate} onChange={setEmiRate} unit="% p.a."
                  />
                  <RangeInput
                    label="Loan tenure"
                    hint="Longer tenure means lower monthly EMI but significantly higher total interest paid."
                    min={1} max={30} step={1}
                    value={emiTenureYears} onChange={setEmiTenureYears} unit=" yrs"
                  />

                  {/* Primary result card */}
                  <div className="mt-2 rounded-2xl bg-[#001A33] text-white px-5 py-6 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300 mb-1">Monthly EMI</p>
                    <p className="text-5xl font-black tracking-tight">{fmt(emiCalc.emi)}</p>
                    <p className="text-xs text-blue-300 mt-2">
                      {emiTenureYears} yr{emiTenureYears !== 1 ? 's' : ''} · {emiRate}% p.a. · reducing balance
                    </p>
                  </div>

                  {/* Breakup */}
                  <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-100 p-4">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2">Payment breakup</p>
                    <StatRow label="Principal amount" value={fmtL(loanAmount)} />
                    <StatRow label="Total interest payable" value={fmtL(emiCalc.totalInterest)} />
                    <StatRow label="Total amount payable" value={fmtL(emiCalc.totalPayment)} highlight />

                    {/* Bar chart */}
                    <div className="mt-4 h-2.5 rounded-full bg-slate-200 overflow-hidden flex">
                      <div
                        className="h-full bg-[#001A33] transition-all duration-300"
                        style={{ width: `${emiCalc.principalPct}%` }}
                      />
                      <div
                        className="h-full bg-blue-300 transition-all duration-300"
                        style={{ width: `${emiCalc.interestPct}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2">
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#001A33] inline-block" />
                        Principal {emiCalc.principalPct}%
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        Interest {emiCalc.interestPct}%
                        <span className="w-2 h-2 rounded-full bg-blue-300 inline-block" />
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-300 text-center mt-3 leading-relaxed">
                    Calculated using the reducing-balance method as per RBI guidelines.
                  </p>
                </div>
              )}

              {/* ══════ AFFORDABILITY TAB ══════ */}
              {activeTab === 'affordability' && (
                <div>
                  {/* How-banks-calculate banner */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-5 text-xs text-blue-700 leading-relaxed">
                    <strong>How banks calculate this:</strong> Banks cap total EMI obligations at {foirPct}% of gross income (FOIR). Your existing EMIs are deducted first; the balance determines your eligible home loan amount.
                  </div>

                  <RangeInput
                    label="Gross monthly income"
                    hint="Use your gross (pre-tax) monthly salary or business income as per your ITR/salary slip."
                    min={20000} max={2000000} step={5000}
                    value={grossIncome} onChange={setGrossIncome} isCurrency
                  />
                  <RangeInput
                    label="Existing monthly EMIs"
                    hint="Sum of all current loan EMIs: car, personal loan, credit cards, etc."
                    min={0} max={500000} step={1000}
                    value={existingEmi} onChange={setExistingEmi} isCurrency
                  />
                  <RangeInput
                    label="FOIR (bank allowance %)"
                    hint="Fixed Obligation to Income Ratio. SBI/HDFC/ICICI typically use 40–55%. Higher income earners often qualify for higher FOIR."
                    min={40} max={60} step={5}
                    value={foirPct} onChange={setFoirPct} unit="%"
                  />
                  <RangeInput
                    label="Interest rate"
                    min={6} max={15} step={0.05}
                    value={affordRate} onChange={setAffordRate} unit="% p.a."
                  />
                  <RangeInput
                    label="Loan tenure"
                    min={1} max={30} step={1}
                    value={affordTenureYears} onChange={setAffordTenureYears} unit=" yrs"
                  />
                  <RangeInput
                    label="Down payment available"
                    hint="Amount you can pay upfront. Banks require a minimum 10–20% down payment (LTV cap of 80–90%)."
                    min={0} max={30000000} step={100000}
                    value={downPayment} onChange={setDownPayment} isCurrency
                  />

                  {/* Calculation trace */}
                  <div className="mt-2 rounded-2xl bg-slate-50 border border-slate-100 p-4 mb-3">
                    <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest mb-2">How we arrived at this</p>
                    <StatRow label={`Gross income × ${foirPct}% FOIR`}          value={fmtL((grossIncome * foirPct) / 100)} small />
                    <StatRow label="Less: existing EMIs"                           value={`− ${fmtL(existingEmi)}`}               small muted={existingEmi === 0} />
                    <StatRow label="Available for home loan EMI"                   value={fmtL(affordCalc.maxEmi)}               small />
                    <StatRow label={`Eligible loan (${affordTenureYears}yr @ ${affordRate}%)`} value={fmtL(affordCalc.eligibleLoan)} />
                    <StatRow label="Down payment required"                          value={fmtL(affordCalc.finalDownPayment)} />
                  </div>

                  {/* LTV warning */}
                  {affordCalc.ltvBinding && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-3 text-xs text-amber-700 leading-relaxed">
                      ⚠ Bank's 80% LTV cap is the limiting factor here, not your income. You may need a larger down payment to buy a higher-value property.
                    </div>
                  )}

                  {/* Zero EMI state */}
                  {affordCalc.maxEmi <= 0 && (
                    <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-3 text-xs text-red-600 leading-relaxed">
                      Your existing EMIs exceed the FOIR limit. Reduce existing obligations or increase income to qualify for a home loan.
                    </div>
                  )}

                  {/* Primary result card */}
                  <div className="rounded-2xl bg-[#001A33] text-white px-5 py-6 text-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300 mb-1">
                      Affordable property value
                    </p>
                    <p className="text-4xl font-black tracking-tight">{fmt(affordCalc.affordableProperty)}</p>
                    <p className="text-sm text-blue-200 mt-1 font-medium">{fmtL(affordCalc.affordableProperty)}</p>
                    <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white/10 rounded-xl py-2.5">
                        <p className="text-blue-300 mb-0.5">Loan amount</p>
                        <p className="font-bold text-white text-sm">{fmtL(affordCalc.eligibleLoan)}</p>
                      </div>
                      <div className="bg-white/10 rounded-xl py-2.5">
                        <p className="text-blue-300 mb-0.5">Monthly EMI</p>
                        <p className="font-bold text-white text-sm">{fmt(affordCalc.emiOnFinalLoan)}</p>
                      </div>
                    </div>
                  </div>

                  {/* ── PROMINENT CTA ─────────────────────────────────────── */}
                  <button
                    onClick={handleSearchProperties}
                    disabled={affordCalc.affordableProperty <= 0}
                    className="w-full mt-4 bg-[#001A33] hover:bg-[#002a52] disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all text-white py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 shadow-lg shadow-slate-900/20"
                  >
                    <span>Find properties in this budget</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <p className="text-[11px] text-slate-400 text-center mt-2">
                    Browse properties up to {fmtL(affordCalc.affordableProperty)}
                  </p>

                  <p className="text-[10px] text-slate-300 text-center mt-5 leading-relaxed">
                    Estimates based on FOIR method. Actual eligibility depends on credit score, age, employer profile, and lender policy.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FinancialCalculator;