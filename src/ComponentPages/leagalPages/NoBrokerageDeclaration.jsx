import React from 'react';

const NoBrokerageDeclaration = () => {
  const lastUpdated = "April 22, 2026";

  return (
    <div className="bg-white min-h-screen py-16 px-6 sm:px-10 lg:px-16 font-sans text-gray-800 tracking-tight">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-16 border-b border-gray-100 pb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 uppercase tracking-tighter">
            No Brokerage & No Agency Declaration
          </h1>
          <div className="text-base md:text-lg text-gray-500 space-y-1">
            <p className="font-semibold text-gray-900 uppercase">For DENIVSERVICES (Brand: DENIVS)</p>
            <p className="text-sm font-mono mt-4">Last Updated: {lastUpdated}</p>
          </div>
        </header>

        {/* Content Section */}
        <main className="space-y-12 text-lg leading-relaxed text-gray-700">
          
          <section className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Platform Identity</h2>
            <p className="text-justify">
              Denivservices, operating under the brand name **DENIVS**, is a technology-enabled digital advertising and SaaS platform. The Platform only provides online infrastructure for publishing information and promoting real estate projects, properties, and related services.
            </p>
          </section>

          <section className="space-y-6">
            <p className="text-justify font-medium text-gray-900">
              DENIVS does not act as a real estate broker, property dealer, agent, channel partner, consultant, mediator, negotiator, representative, or facilitator of any transaction. DENIVS does not represent any buyer, seller, builder, developer, landowner, broker, advertiser or any other party in any capacity whatsoever.
            </p>

            <div className="pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-black pl-4 uppercase">
                DENIVS Does Not:
              </h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 list-none">
                {[
                  "Negotiate or finalize prices or commercial terms",
                  "Draft, verify or execute agreements",
                  "Collect or handle consideration or booking amounts",
                  "Hold escrow or trust money",
                  "Conduct site visits or inspections",
                  "Provide legal, financial or investment advice",
                  "Guarantee sales, bookings, returns or possession",
                  "Verify ownership, title, approvals or regulatory compliance"
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2 font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="pt-8 border-t border-gray-100">
            <p className="text-justify">
              All property information, advertisements, listings and representations available on the Platform are uploaded by respective advertisers or users at their sole responsibility. Any interaction, communication, negotiation or transaction undertaken pursuant to such information is strictly between the concerned parties, and DENIVS has no role, control, participation or liability in the same.
            </p>
          </section>

          <section className="bg-black text-white p-8 rounded-2xl shadow-xl">
            <p className="text-justify text-gray-300">
              Use of the Platform shall not be construed as creating any agency, partnership, joint venture, fiduciary or employment relationship between DENIVS and any user. DENIVS shall not be liable for any dispute, loss, damage or claim arising out of user-to-user dealings.
            </p>
          </section>

        </main>

        <footer className="mt-24 pt-12 border-t border-gray-100 text-center text-gray-400 text-xs tracking-widest uppercase">
          © 2026 DENIVS • Denivservices All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default NoBrokerageDeclaration;