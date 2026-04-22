import React from 'react';

const ReraDisclaimer = () => {
  const lastUpdated = "April 22, 2026";

  return (
    <div className="bg-white min-h-screen py-16 px-6 sm:px-10 lg:px-16 font-sans text-gray-800 tracking-tight">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-16 border-b border-gray-100 pb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 uppercase tracking-tighter">
            RERA Disclaimer Page
          </h1>
          <div className="text-base md:text-lg text-gray-500 space-y-1">
            <p className="font-semibold text-gray-900 uppercase">For DENIVSERVICES (Brand: DENIVS)</p>
            <p className="text-sm font-mono mt-4">Last Updated: {lastUpdated}</p>
          </div>
        </header>

        {/* Content Section */}
        <main className="space-y-12 text-lg leading-relaxed text-gray-700">
          
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 uppercase tracking-widest border-b pb-2 w-fit">
              RERA Compliance & Regulatory Disclaimer
            </h2>
            <p className="text-justify">
              Denivservices, operating the digital platform under the brand name **DENIVS**, is not a real estate agent, promoter, developer, intermediary or facilitator under the Real Estate (Regulation and Development) Act, 2016 (“RERA”) or any rules or regulations made thereunder.
            </p>
            <p className="text-justify font-medium text-gray-900">
              DENIVS is only a technology and digital advertising platform that enables users to publish property information and connect with each other.
            </p>
          </section>

          <section className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 uppercase">DENIVS does not:</h3>
            <ul className="space-y-3">
              {[
                "Verify RERA registration numbers",
                "Authenticate project approvals or sanctions",
                "Validate ownership, title or development rights",
                "Certify project details, layouts, specifications or timelines",
                "Monitor construction progress or compliance",
                "Act on behalf of any RERA-registered promoter or agent",
                "Provide regulatory, legal or investment advice"
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-gray-400 mr-4"></span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <p className="text-justify">
              All project and property details displayed on the Platform, including RERA registration status, pricing, carpet area, approvals, amenities and timelines, are provided by the respective advertisers or uploaders. DENIVS does not independently verify the accuracy, completeness or legal validity of such information.
            </p>
          </section>

          <section className="bg-blue-50 p-8 rounded-2xl border border-blue-100">
            <h3 className="text-lg font-bold text-blue-900 mb-4 uppercase">Users are strongly advised to:</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="font-bold text-blue-600 mr-3">01.</span>
                <p>Verify RERA registration of the project on the official RERA website of the concerned State</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-600 mr-3">02.</span>
                <p>Conduct independent legal, technical and financial due diligence</p>
              </li>
              <li className="flex items-start">
                <span className="font-bold text-blue-600 mr-3">03.</span>
                <p>Consult qualified professionals before making any decision</p>
              </li>
            </ul>
          </section>

          <section className="pt-8 border-t border-gray-100 italic">
            <p className="text-justify text-gray-500 text-base">
              DENIVS shall not be responsible or liable for any non-compliance, misrepresentation, delay, deficiency, dispute, loss or damage arising out of reliance on information displayed on the Platform or from any transaction entered into between users.
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

export default ReraDisclaimer;