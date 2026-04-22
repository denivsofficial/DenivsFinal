import React from 'react';

const MasterDisclaimer = () => {
  const lastUpdated = "April 22, 2026";

  return (
    <div className="bg-white min-h-screen py-16 px-6 sm:px-10 lg:px-16 font-sans text-gray-800">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-16 border-b pb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 tracking-tight uppercase">
            Master Disclaimer
          </h1>
          <div className="text-base md:text-lg text-gray-600 space-y-2">
            <p className="font-semibold text-black uppercase tracking-wide">Denivservices</p>
            <p className="italic text-gray-500">(Proposed Entity under Incorporation in India)</p>
            <p>Brand: <span className="text-gray-900 font-medium">DENIVS</span></p>
            <p>Contact: <span className="text-gray-900">contact@denivs.com</span></p>
            <p className="text-sm mt-6 text-gray-400 font-mono">Last Updated: {lastUpdated}</p>
          </div>
        </header>

        {/* Content Section */}
        <main className="space-y-12 leading-relaxed text-gray-700">
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight">1. Platform Nature Disclaimer</h2>
            <div className="space-y-4 text-justify">
              <p>
                DENIVS is a technology-enabled digital advertising and Software-as-a-Service (SaaS) platform that provides online infrastructure for publishing property information, promotional content, listings, and related digital services. The Platform functions solely as an information hosting and communication interface.
              </p>
              <p>
                DENIVS does not own, develop, sell, resell, lease, sub-lease, market, negotiate, or transact in any real estate. DENIVS does not participate in the creation, negotiation, execution, performance or enforcement of any agreement between users.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight">2. No Broker, No Agent, No Mediator</h2>
            <div className="space-y-4">
              <p className="text-justify">
                DENIVS is not a real estate broker, property dealer, channel partner, consultant, intermediary, mediator, representative, fiduciary, advisor, attorney, or transaction facilitator.
              </p>
              <p className="font-semibold text-gray-900">DENIVS does not:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Act on behalf of any buyer, seller, builder, developer, landowner, broker or advertiser</li>
                <li>Negotiate prices or commercial terms</li>
                <li>Finalize or conclude transactions</li>
                <li>Draft, verify or execute agreements</li>
                <li>Handle booking amounts, advances, deposits or consideration</li>
                <li>Hold escrow or trust funds</li>
                <li>Conduct site visits or inspections</li>
                <li>Provide legal, financial, investment or tax advice</li>
                <li>Guarantee sales, bookings, possession, approvals or returns</li>
              </ul>
              <p className="italic bg-gray-50 p-4 border-l-4 border-gray-900 mt-4">
                All commercial dealings occur strictly between users at their own discretion and risk.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight">3. Intermediary & Safe Harbour</h2>
            <p className="text-justify">
              DENIVS operates as an intermediary under the Information Technology Act, 2000 and Intermediary Guidelines Rules, 2021. All content is uploaded by third-party users. DENIVS does not initiate, select, modify, verify or control user-generated content. DENIVS is not responsible for the accuracy, legality, authenticity, completeness or reliability of any listing, advertisement, image, video, document, claim or representation made by any user.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight">4. No Verification & No Due Diligence</h2>
            <div className="space-y-4">
              <p className="font-semibold text-gray-900">DENIVS does not verify or validate:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 pl-6">
                <ul className="list-disc space-y-2">
                  <li>Title or ownership</li>
                  <li>RERA registration</li>
                  <li>Approvals or sanctions</li>
                  <li>Layouts or building plans</li>
                  <li>Carpet area or measurements</li>
                </ul>
                <ul className="list-disc space-y-2">
                  <li>Pricing or payment schedules</li>
                  <li>Construction quality</li>
                  <li>Possession timelines</li>
                  <li>Legal compliance</li>
                  <li>Financial viability</li>
                </ul>
              </div>
              <p className="mt-4 font-medium text-gray-900">
                Users must conduct independent legal, technical, regulatory and financial due diligence.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight">5. RERA & Regulatory Disclaimer</h2>
            <p className="text-justify">
              DENIVS is not a real estate agent or promoter under the Real Estate (Regulation and Development) Act, 2016. DENIVS does not certify or monitor regulatory compliance. RERA numbers and project details displayed are provided by advertisers and must be independently verified on the official RERA portal of the respective State.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight">6. No Investment Advice</h2>
            <p className="text-justify">
              Nothing on the Platform constitutes investment advice, financial advice, legal advice, tax advice or professional consultation. All decisions taken based on information on the Platform are at the user’s sole risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight">7. No Guarantee of Outcomes</h2>
            <div className="space-y-4">
              <p className="font-semibold text-gray-900 text-justify">DENIVS does not guarantee:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 list-disc pl-6 gap-2">
                <li>Leads</li>
                <li>Conversions</li>
                <li>Sales</li>
                <li>Bookings</li>
                <li>Return on Investment (ROI)</li>
                <li>Appreciation</li>
                <li>Rental income</li>
                <li>Possession</li>
                <li>Project completion</li>
                <li>Regulatory approvals</li>
              </ul>
              <p className="text-sm text-gray-500 pt-2 border-t border-gray-100">
                Subscription or listing fees only provide digital visibility and technology access.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight">8. Third-Party Services & Payment Gateways</h2>
            <p className="text-justify">
              Payments are processed through third-party gateways. DENIVS does not control banking systems and is not liable for transaction failures, chargebacks, delays, technical errors, reversals or fraud.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight">9. Limitation of Liability</h2>
            <div className="space-y-4">
              <p className="font-semibold text-gray-900">DENIVS shall not be liable for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>User-to-user disputes</li>
                <li>Financial losses / Investment losses</li>
                <li>Regulatory non-compliance</li>
                <li>Project delays</li>
                <li>Misrepresentation by advertisers</li>
                <li>Title defects</li>
                <li>Contractual breaches</li>
                <li>Cyber incidents beyond reasonable control</li>
              </ul>
              <p className="font-bold text-gray-900 pt-4">Use of the Platform is entirely at the user’s own risk.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-tight">10. No Fiduciary Relationship</h2>
            <p className="text-justify">
              Use of the Platform does not create any agency, partnership, joint venture, fiduciary, employment or advisory relationship between DENIVS and any user.
            </p>
          </section>

        </main>

        <footer className="mt-24 pt-12 border-t text-center text-gray-400 text-xs tracking-widest uppercase">
          © 2026 DENIVS • Denivservices All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default MasterDisclaimer;