import React from 'react';
import { Facebook, Youtube, Instagram, Twitter, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    'About us', 'Contact us', 'Privacy Policy', 'Careers with us',
    'Terms & Conditions', 'Request Info', 'Feedback', 'Report a problem',
    'Testimonials', 'Summons/Notices', 'Grievances', 'Safety Guide',
  ];

  const quickLinks = [
    'Mobile Apps', 'Our Services', 'Price Trends', 'Post your Property',
    'Real Estate Investments', 'Builders in India', 'Area Converter',
    'Articles', 'Rent Receipt', 'Customer Service', 'Sitemap',
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/denivs_official', label: 'Facebook', hoverColor: 'hover:text-blue-500' },
    { icon: Youtube, href: 'https://www.youtube.com/@Denivs_official', label: 'YouTube', hoverColor: 'hover:text-red-500' },
    { icon: Twitter, href: 'https://www.twitter.com/denivs_official', label: 'Twitter', hoverColor: 'hover:text-sky-400' },
    { icon: Instagram, href: 'https://www.instagram.com/denivs_offcial', label: 'Instagram', hoverColor: 'hover:text-pink-500' },
  ];

  return (
    <footer className="bg-[#0a192f] text-slate-400 font-sans">

      {/* ── Main Grid ── */}
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-slate-700/60 pb-12">

          {/* ── Brand Column ── */}
          <div className="lg:col-span-1">
            <div className="mb-4 select-none">
              <h2 className="text-2xl font-serif tracking-[0.2em] text-[#d4af37] font-semibold">DENIVS</h2>
              <p className="text-[10px] tracking-[0.3em] text-[#d4af37]/70 mt-0.5 uppercase">Dream. Discover. Denivs</p>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 mt-4">
              Your trusted partner for buying, renting, and investing in premium real estate across India.
            </p>
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map(({ icon: Icon, href, label, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`text-slate-500 ${hoverColor} transition-colors duration-200`}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-slate-400 hover:text-[#d4af37] transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Company ── */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Company</h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-slate-400 hover:text-[#d4af37] transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-[#d4af37] mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-slate-300">+91 7447318961</p>
                  <p className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                    <Clock size={11} className="shrink-0" />
                    9:30 AM – 6:30 PM (Mon–Sun)
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-[#d4af37] mt-0.5 shrink-0" />
                <a
                  href="mailto:contact@denivs.com"
                  className="text-sm text-slate-300 hover:text-[#d4af37] transition-colors duration-200 break-all"
                >
                  contact@denivs.com
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ── Bottom Bar ── */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-600">
          <p>© {currentYear} DENIVS — DENIVServices. All rights reserved.</p>
          <p>All trademarks are the property of their respective owners.</p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;

