import React from 'react';

const RefundPolicy = () => {
  const lastUpdated = "April 22, 2026";

  return (
    <div className="bg-white min-h-screen py-16 px-6 sm:px-10 lg:px-16 font-sans text-gray-800 tracking-tight">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-16 border-b border-gray-100 pb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 uppercase tracking-tighter">
            Refund & Cancellation Policy
          </h1>
          <div className="text-base md:text-lg text-gray-500 space-y-1">
            <p className="font-semibold text-gray-900 uppercase">Denivservices</p>
            <p className="italic text-gray-400 font-medium">(Proposed Entity under Incorporation in India)</p>
            <p>Brand: <span className="text-gray-900 font-medium">DENIVS</span></p>
            <p>Contact: <span className="text-gray-900">contact@denivs.com</span></p>
            <p className="text-sm font-mono mt-4">Last Updated: {lastUpdated}</p>
          </div>
        </header>

        {/* Introduction */}
        <div className="mb-12 text-lg text-gray-600 leading-relaxed italic border-l-4 border-gray-200 pl-6">
          This Refund & Cancellation Policy governs all payments made to Denivservices for subscription plans, listing packages, advertising services, SaaS tools and any other paid digital services offered on or through the DENIVS Platform. By making a payment on the Platform, you expressly agree to the terms set out in this Policy.
        </div>

        {/* Content Section */}
        <main className="space-y-12 text-lg leading-relaxed text-gray-700">
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-widest border-b pb-2 w-fit">
              1. Nature of Services
            </h2>
            <p className="text-justify">
              DENIVS provides digital and technology-based services, including but not limited to online listings, digital advertising space, SaaS access, data hosting, visibility tools and analytics. These are non-tangible, non-returnable and time-bound digital services. Once activated, delivered, or made accessible, such services cannot be physically returned or restored.
            </p>
          </section>

          <section className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase">
              2. Subscription and Listing Fee Payments
            </h2>
            <p className="text-justify font-semibold text-gray-900 mb-4 underline decoration-red-200 decoration-4 underline-offset-4">
              All subscription fees, listing fees, advertisement charges and SaaS access fees paid on the Platform are, unless expressly stated otherwise in writing, non-refundable.
            </p>
            <p className="text-justify text-sm text-gray-600">
              The User acknowledges that failure to receive expected business results shall not entitle the User to any refund or chargeback.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-widest">
              3. Cancellation by User
            </h2>
            <p className="mb-4">
              Users may cancel their subscription at any time through their account dashboard or by writing to **contact@denivs.com**. No refund, full or partial, shall be issued for:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 list-none font-medium">
              {[
                "Unused subscription period",
                "Unused listing duration",
                "Early termination",
                "Change of business plans",
                "Dissatisfaction with leads",
                "Mistaken purchase",
                "Lack of usage"
              ].map((item, index) => (
                <li key={index} className="flex items-center text-gray-500">
                  <span className="text-red-400 mr-2">—</span> {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase">
              4. Exceptional Refund Circumstances
            </h2>
            <p className="mb-4 italic">Refunds may be considered solely in the following limited circumstances:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Duplicate payment due to technical error</li>
              <li>Excess amount charged due to system malfunction</li>
              <li>Payment debited but service not activated due to verified technical failure</li>
            </ul>
            <p className="text-sm bg-blue-50 p-4 rounded-lg text-blue-800">
              Requests must be submitted in writing within <strong>seven (7) days</strong> of the transaction with supporting evidence.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase">
              5. Payment Gateway and Banking Delays
            </h2>
            <p className="text-justify">
              All payments are processed through third-party gateways. DENIVS does not control and shall not be responsible for transaction failures, delayed settlements, reversals, chargebacks, or banking downtime. Refunds shall be processed to the original mode of payment subject to banking timelines.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase">6. Taxes</h2>
              <p className="text-sm text-gray-600">
                Any refund, if granted, shall be net of applicable taxes (GST). GST once remitted to the Government shall be refunded only in accordance with tax regulations.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase">7. Policy Violations</h2>
              <p className="text-sm text-gray-600">
                No refund shall be granted where accounts are suspended for violation of Terms, fraudulent activity, or misuse of the platform.
              </p>
            </div>
          </section>

          <section className="bg-black text-white p-8 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-widest text-center border-b border-gray-800 pb-4">
              9. No Guarantee of Business Outcomes
            </h2>
            <p className="text-center text-gray-300">
              DENIVS does not guarantee leads, inquiries, conversions, bookings, sales, rentals, investment returns, or any business result. Absence of expected performance shall not be a ground for refund or compensation.
            </p>
            <div className="mt-8 text-center border-t border-gray-800 pt-6">
              <p className="text-sm text-gray-500 mb-1">For refund queries, contact:</p>
              <p className="text-lg font-bold text-white tracking-widest">contact@denivs.com</p>
            </div>
          </section>

        </main>

        <footer className="mt-24 pt-12 border-t border-gray-100 text-center text-gray-400 text-xs tracking-widest uppercase">
          © 2026 DENIVS • Denivservices All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default RefundPolicy;