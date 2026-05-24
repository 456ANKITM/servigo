import React from "react";
import logo from "../assets/favicon.svg";

const Footer = () => {
  return (
    <footer className=" pt-12 px-6 md:px-16 lg:px-24 xl:px-32 bg-zinc-950 text-gray-400 border-t border-white/10">
      
      {/* Top Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Logo + Description */}
        <div>
          <img
            src={logo}
            alt="logo"
            className="mb-4 h-10"
          />
          <p className="text-sm leading-relaxed text-gray-500">
            We connect you with trusted local professionals for everyday services.
            From electricians to drivers, find and hire easily with confidence.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-5">
            {[
              "instagram",
              "facebook",
              "twitter",
              "linkedin",
            ].map((icon, i) => (
              <div
                key={i}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-zinc-900 hover:bg-white/10 cursor-pointer transition"
              >
                <svg
                  className="w-4 h-4 text-gray-400 hover:text-white transition"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {icon === "instagram" && (
                    <path d="M7.75 2A5.75 5.75 0 002 7.75v8.5A5.75 5.75 0 007.75 22h8.5A5.75 5.75 0 0022 16.25v-8.5A5.75 5.75 0 0016.25 2h-8.5zM4.5 7.75A3.25 3.25 0 017.75 4.5h8.5a3.25 3.25 0 013.25 3.25v8.5a3.25 3.25 0 01-3.25 3.25h-8.5a3.25 3.25 0 01-3.25-3.25v-8.5zm9.5 1a4 4 0 11-4 4 4 4 0 014-4z" />
                  )}
                  {icon === "facebook" && (
                    <path d="M13.5 9H15V6.5h-1.5c-1.933 0-3.5 1.567-3.5 3.5v1.5H8v3h2.5V21h3v-7.5H16l.5-3h-3z" />
                  )}
                  {icon === "twitter" && (
                    <path d="M22 5.92a8.2 8.2 0 01-2.36.65A4.1 4.1 0 0021.4 4a8.27 8.27 0 01-2.6 1A4.14 4.14 0 0016 4a4.15 4.15 0 00-4.15 4.15c0 .32.04.64.1.94a11.75 11.75 0 01-8.52-4.32z" />
                  )}
                  {icon === "linkedin" && (
                    <path d="M3 8.75h3.96V21H3V8.75zm1.98-5.25C3.88 3.5 3 4.38 3 5.48c0 1.1.88 1.98 1.98 1.98S6.96 6.58 6.96 5.48C6.96 4.38 6.08 3.5 4.98 3.5zM9.25 8.75h3.8v1.68h.05c.53-.98 1.82-2.02 3.75-2.02 4.01 0 4.75 2.64 4.75 6.07V21H17v-5.63c0-1.34-.03-3.07-1.88-3.07-1.88 0-2.17 1.47-2.17 2.98V21H9.25V8.75z" />
                  )}
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Company */}
        <div>
          <p className="text-white font-semibold mb-4">Company</p>
          <ul className="space-y-2 text-sm">
            {["About", "Careers", "Blog", "Partners"].map((item) => (
              <li key={item}>
                <a href="#" className="hover:text-white transition">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <p className="text-white font-semibold mb-4">Support</p>
          <ul className="space-y-2 text-sm">
            {["Help Center", "Safety", "Contact Us", "Accessibility"].map(
              (item) => (
                <li key={item}>
                  <a href="#" className="hover:text-white transition">
                    {item}
                  </a>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <p className="text-white font-semibold mb-4">Stay Updated</p>
          <p className="text-sm text-gray-500">
            Get updates on new services and offers near you.
          </p>

          <div className="flex items-center mt-4 bg-zinc-900 border border-white/10 rounded-lg overflow-hidden">
            <input
              type="email"
              placeholder="Your email"
              className="bg-transparent px-3 py-2 w-full outline-none text-sm text-white placeholder-gray-500"
            />
            <button className="bg-indigo-600 px-4 py-2 hover:bg-indigo-700 transition">
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M19 12H5m14 0-4 4m4-4-4-4"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <p className="text-gray-500">
          © {new Date().getFullYear()} YourPlatform. All rights reserved.
        </p>

        <div className="flex gap-5">
          {["Privacy", "Terms", "Sitemap"].map((item) => (
            <a key={item} href="#" className="hover:text-white transition">
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;