import React from 'react';

const CookiePolicy = () => {
  const lastUpdated = "April 22, 2026";

  return (
    <div className="bg-white min-h-screen py-16 px-6 sm:px-10 lg:px-16 font-sans text-gray-800 tracking-tight">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <header className="mb-16 border-b border-gray-100 pb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 uppercase tracking-tighter">
            Cookie Policy
          </h1>
          <div className="text-base md:text-lg text-gray-500 space-y-1">
            <p className="font-semibold text-gray-900 uppercase tracking-wide">Denivservices</p>
            <p className="italic text-gray-400 font-medium">(Proposed Entity under Incorporation in India)</p>
            <p>Brand: <span className="text-gray-900 font-medium">DENIVS</span></p>
            <p>Jurisdiction: <span className="text-gray-900 font-medium">Chhatrapati Sambhajinagar, Maharashtra, India</span></p>
            <p>Contact: <span className="text-gray-900">contact@denivs.com</span></p>
            <p className="text-sm font-mono mt-4">Last Updated: {lastUpdated}</p>
          </div>
        </header>

        {/* Introduction */}
        <div className="mb-12 text-lg text-gray-600 leading-relaxed text-justify">
          <p>
            This Cookie Policy explains how Denivservices, operating under the brand name **DENIVS** (“Company”, “we”, “our”, “us”), uses cookies and similar technologies on its website, mobile applications (present and future), and digital platforms (collectively, the “Platform”). This Policy forms part of and should be read together with the Privacy Policy and Terms & Conditions.
          </p>
          <p className="mt-4 font-medium text-gray-900">
            By accessing or using the Platform, you consent to the use of cookies in accordance with this Cookie Policy, subject to your browser and device settings.
          </p>
        </div>

        {/* Content Section */}
        <main className="space-y-12 text-lg leading-relaxed text-gray-700">
          
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-widest border-b pb-2 w-fit">
              1. What Are Cookies
            </h2>
            <p className="text-justify">
              Cookies are small text files that are placed on your device (computer, smartphone, tablet or other internet-enabled device) when you visit a website. Cookies allow the Platform to recognize your device, store certain information about your preferences, and enhance your browsing experience by enabling functionality, security, analytics and performance optimization.
            </p>
            <p className="mt-4 text-sm text-gray-500 italic">
              Cookies do not typically contain information that directly identifies you personally, but they may be linked to personal data as governed by our Privacy Policy and the Digital Personal Data Protection Act, 2023.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6 uppercase tracking-widest">
              2. Types of Cookies We Use
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-2">a) Strictly Necessary Cookies</h3>
                <p className="text-sm text-gray-600">Essential for core functions like authentication, security, and session management. The Platform cannot function properly without these.</p>
              </div>
              <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-2">b) Functional Cookies</h3>
                <p className="text-sm text-gray-600">Remember your preferences (language, region, settings) to provide a more personalized and efficient user experience.</p>
              </div>
              <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-2">c) Performance & Analytics</h3>
                <p className="text-sm text-gray-600">Collect aggregated, anonymized data on how users interact with the Platform to help us improve functionality and quality.</p>
              </div>
              <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-900 mb-2">d) Advertising & Targeting</h3>
                <p className="text-sm text-gray-600">Used to display relevant advertisements and measure campaign effectiveness, potentially placed by third-party partners.</p>
              </div>
            </div>
          </section>

          <section className="bg-black text-white p-8 rounded-2xl">
            <h2 className="text-xl font-bold mb-4 uppercase tracking-widest">3. Third-Party Cookies</h2>
            <p className="text-gray-300 text-justify">
              The Platform may allow third-party service providers (analytics, advertising networks, cloud providers, payment gateways) to place cookies on your device. We do not control these cookies and are not responsible for their privacy practices. We advise users to review third-party policies independently.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-widest">4. Purpose of Using Cookies</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 list-none font-medium">
              {[
                "Secure login and authentication",
                "Maintaining user sessions",
                "Remembering preferences",
                "Analyzing traffic and usage",
                "Improving Platform features",
                "Delivering relevant content",
                "Fraud detection and prevention"
              ].map((item, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-3"></span> {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 uppercase tracking-widest">5. User Control</h2>
            <p className="mb-4">You can manage cookies through your browser settings, allowing you to view, delete, or block certain categories of cookies. Note that disabling cookies may affect Platform functionality.</p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase">6. Consent</h2>
              <p className="text-sm text-gray-600">Continuing to use the Platform constitutes consent to our use of cookies. You may withdraw consent at any time via browser settings.</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase">7. Legal Compliance</h2>
              <p className="text-sm text-gray-600">All data is processed under the Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000.</p>
            </div>
          </section>

          <section className="bg-blue-50 p-8 rounded-2xl text-center border border-blue-100">
            <h2 className="text-xl font-bold text-blue-900 mb-4 uppercase">9. Contact Information</h2>
            <p className="text-blue-800 mb-1 font-medium underline">contact@denivs.com</p>
            <p className="text-xs text-blue-400 mt-4 italic">
              Updates to this policy are effective immediately upon publication on the Platform.
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

export default CookiePolicy;