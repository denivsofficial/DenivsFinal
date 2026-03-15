import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Youtube, Twitter, Instagram, Mail, Phone } from 'lucide-react';

const companyLinks = [
  { label: 'About us',           path: '/about' },
  { label: 'Contact us',         path: '/contact' },
  { label: 'Privacy Policy',     path: '/privacy-policy' },
  { label: 'Careers',            path: '/careers' },
  { label: 'Terms & Conditions', path: '/terms' },
  { label: 'Request Info',       path: '/request-info' },
  { label: 'Feedback',           path: '/feedback' },
  { label: 'Report a problem',   path: '/report' },
  { label: 'Testimonials',       path: '/testimonials' },
  { label: 'Summons/Notices',    path: '/summons' },
  { label: 'Grievances',         path: '/grievances' },
  { label: 'Safety Guide',       path: '/safety-guide' },
];

const socialLinks = [
  { label: 'Facebook', href: '#', icon: Facebook, hover: 'hover:text-blue-500' },
  { label: 'YouTube', href: '#', icon: Youtube, hover: 'hover:text-red-500' },
  { label: 'Twitter', href: '#', icon: Twitter, hover: 'hover:text-sky-400' },
  { label: 'Instagram', href: '#', icon: Instagram, hover: 'hover:text-pink-500' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a192f] text-slate-300 pt-16 pb-8 px-6 font-sans border-t border-slate-800">
      {/* 1. Increased max-width for better space utilization */}
      <div className="max-w-6xl mx-auto">
        
        {/* 2. Larger Link Grid with improved readability */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-5 pb-12 border-b border-slate-800/60">
          {companyLinks.map(({ label, path }) => (
            <Link
              key={label}
              to={path}
              className="text-sm md:text-base text-slate-400 hover:text-white transition-all hover:translate-x-1 inline-block"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* 3. Main Branding & Contact Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end py-12 gap-10">
          
          {/* Branding Left */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h2 className="text-5xl md:text-6xl font-serif tracking-widest text-[#d4af37] font-semibold">
              DENIVS
            </h2>
            <p className="text-xs md:text-sm tracking-[0.4em] text-[#b8922e] mt-2 uppercase opacity-90">
              Dream. Discover. Denivs
            </p>
          </div>

          {/* Contact & Socials Center/Right */}
          <div className="flex flex-col items-center lg:items-end gap-6 order-1 lg:order-2">
            <div className="flex flex-col items-center lg:items-end space-y-2">
               <div className="flex items-center gap-2 text-slate-200">
                  <Phone size={18} className="text-[#d4af37]" />
                  <span className="text-lg font-medium">+91 7447318961</span>
               </div>
               <div className="flex items-center gap-2 text-slate-400">
                  <Mail size={18} />
                  <a href="mailto:contact@denivs.com" className="text-base hover:text-white transition-colors underline decoration-slate-700 underline-offset-4">
                    contact@denivs.com
                  </a>
               </div>
               <p className="text-xs text-slate-500 italic">9:30 AM – 6:30 PM (Mon–Sun)</p>
            </div>

            <div className="flex gap-5 pt-2">
              {socialLinks.map(({ label, href, icon: Icon, hover }) => (
                <a
                  key={label}
                  href={href}
                  className={`p-2.5 rounded-full bg-slate-800/40 text-slate-400 ${hover} hover:bg-slate-800 transition-all transform hover:-translate-y-1`}
                >
                  <Icon size={22} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Refined Legal Bottom */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-slate-500">
          <p>© {currentYear} DENIVS. All rights reserved — DENIVServices.</p>
          <p className="text-center md:text-right">All trademarks are the property of their respective owners.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;