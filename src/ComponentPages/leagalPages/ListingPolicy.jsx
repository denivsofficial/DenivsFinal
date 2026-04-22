import React from 'react';

const ListingPolicy = () => {
  const lastUpdated = "April 22, 2026";

  return (
    <div className="bg-white min-h-screen py-16 px-6 sm:px-10 lg:px-16 font-sans text-gray-800 tracking-tight">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-16 border-b border-gray-100 pb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 uppercase tracking-tighter">
            Listing & Advertising Policy
          </h1>
          <div className="text-base md:text-lg text-gray-500 space-y-1">
            <p className="font-semibold text-gray-900 uppercase tracking-wide">Denivservices</p>
            <p className="italic text-gray-400 font-medium">(Proposed Entity under Incorporation in India)</p>
            <p>Brand: <span className="text-gray-900 font-medium">DENIVS</span></p>
            <p>Contact: <span className="text-gray-900">contact@denivs.com</span></p>
            <p className="text-sm font-mono mt-4">Last Updated: {lastUpdated}</p>
          </div>
        </header>

        {/* Introduction */}
        <div className="mb-12 text-lg text-gray-600 leading-relaxed text-justify bg-gray-50 p-8 rounded-2xl border border-gray-100">
          <p>
            This Listing & Advertising Policy governs the submission, publication, display and promotion of all property listings, advertisements, project information, images, videos, descriptions and promotional content (“Content”) on the DENIVS Platform. By submitting any Content, the User expressly agrees to be bound by this Policy.
          </p>
        </div>

        {/* Content Section */}
        <main className="space-y-12 text-lg leading-relaxed text-gray-700">
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-widest border-b pb-2 w-fit">
              1. Nature of Platform
            </h2>
            <p className="text-justify">
              DENIVS is a technology-enabled digital advertising and SaaS platform. DENIVS is not a real estate broker, agent, promoter, or transaction facilitator. We function solely as an information hosting and visibility platform and do not guarantee the accuracy, completeness, or performance of any listing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-widest">
              2. Eligibility to Post
            </h2>
            <p className="mb-4">The User represents and warrants that:</p>
            <ul className="space-y-3 list-none pl-4 border-l-2 border-gray-200">
              <li className="flex items-start"><span className="mr-3 text-blue-500">→</span> They are the owner, developer, or duly empowered advertiser.</li>
              <li className="flex items-start"><span className="mr-3 text-blue-500">→</span> They have obtained all necessary permissions and consents.</li>
              <li className="flex items-start"><span className="mr-3 text-blue-500">→</span> Content complies with RERA (2016) and consumer protection laws.</li>
            </ul>
          </section>

          <section className="bg-gray-900 text-white p-8 rounded-2xl">
            <h2 className="text-xl font-bold mb-6 uppercase tracking-widest text-center border-b border-gray-700 pb-4">
              3. Content Responsibility
            </h2>
            <p className="text-center text-sm text-gray-400 mb-6 italic">DENIVS does not verify or validate:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-light">
              <p>• Ownership or Title</p>
              <p>• Pricing or Payment Schedules</p>
              <p>• RERA Registration Numbers</p>
              <p>• Construction Quality</p>
              <p>• Layout Sanctions</p>
              <p>• Possession Timelines</p>
              <p>• Legal Compliance</p>
              <p>• Financial Viability</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-widest">
              4. Prohibited Content
            </h2>
            <div className="bg-red-50 p-6 rounded-xl border border-red-100 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "False or misleading statements",
                "Guaranteed return claims",
                "Unverified RERA details",
                "Obscene or defamatory material",
                "IP Rights infringement",
                "Duplicate or spam listings"
              ].map((item, index) => (
                <div key={index} className="flex items-center text-red-800 text-base">
                  <span className="font-bold mr-2">!</span> {item}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-widest">
              6. No Guarantee of Outcomes
            </h2>
            <p className="text-justify mb-4">
              DENIVS does not guarantee leads, inquiries, conversions, or business growth. Subscription fees are paid solely for access to digital infrastructure and visibility tools.
            </p>
            <p className="font-bold text-gray-900 text-center py-4 bg-gray-50 rounded-lg">
              Absence of expected performance shall not entitle the User to any refund.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase">7. Intellectual Property</h2>
              <p className="text-sm text-gray-600">Users must ensure Content does not infringe third-party proprietary rights. Users shall indemnify DENIVS against all claims arising from infringement.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase">9. RERA Disclaimer</h2>
              <p className="text-sm text-gray-600">DENIVS is not a RERA-registered agent. All RERA disclosures are advertiser-provided and must be verified on official government portals.</p>
            </div>
          </section>

          <section className="pt-8 text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase">10. Limitation of Liability</h2>
            <p className="text-justify text-gray-500 italic">
              DENIVS shall not be liable for any loss, dispute, misrepresentation, or regulatory non-compliance arising out of interactions or transactions between users. Use of the Platform is at the User’s own risk.
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

export default ListingPolicy;