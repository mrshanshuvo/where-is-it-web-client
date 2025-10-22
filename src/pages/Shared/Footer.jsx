import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start space-y-10 md:space-y-0">
          {/* Brand and Contact Info */}
          <aside className="flex flex-col items-center md:items-start text-center md:text-left space-y-4 md:w-1/4">
            <div className="flex items-center gap-2">
              <img
                src="src\assets\logo.svg"
                alt="WhereIsIt Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold text-white">
                Where<span className="text-blue-400">Is</span>It
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              Reuniting people with their lost belongings since 2023
            </p>
            <div className="space-y-2 text-sm mt-4">
              <div className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-400" />
                <span>123 Finder St, Lost City, LC 12345</span>
              </div>
              <div className="flex items-center gap-2">
                <FaPhoneAlt className="text-blue-400" />
                <span>(123) 456-7890</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-blue-400" />
                <span>help@whereisit.app</span>
              </div>
            </div>
          </aside>

          {/* Navigation */}
          <nav className="flex justify-between flex-grow gap-16 md:gap-24">
            <div>
              <h6 className="font-semibold text-white mb-5">Quick Links</h6>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="/" className="hover:text-blue-400 transition">
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/lost-items"
                    className="hover:text-blue-400 transition"
                  >
                    Lost Items
                  </a>
                </li>
                <li>
                  <a
                    href="/found-items"
                    className="hover:text-blue-400 transition"
                  >
                    Found Items
                  </a>
                </li>
                <li>
                  <a
                    href="/report-item"
                    className="hover:text-blue-400 transition"
                  >
                    Report Item
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h6 className="font-semibold text-white mb-5">Support</h6>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="/faq" className="hover:text-blue-400 transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="/safety-tips"
                    className="hover:text-blue-400 transition"
                  >
                    Safety Tips
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-blue-400 transition">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="/feedback"
                    className="hover:text-blue-400 transition"
                  >
                    Feedback
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h6 className="font-semibold text-white mb-5">Legal</h6>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="/terms" className="hover:text-blue-400 transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-blue-400 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/cookie-policy"
                    className="hover:text-blue-400 transition"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/community-guidelines"
                    className="hover:text-blue-400 transition"
                  >
                    Community Guidelines
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          {/* Newsletter */}
          <div className="mb-6 md:mb-0">
            <h6 className="font-semibold text-white mb-3">
              Subscribe to our newsletter
            </h6>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 rounded-l-md focus:outline-none text-gray-800 w-full max-w-xs"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-md transition">
                Subscribe
              </button>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              aria-label="Facebook"
              className="text-gray-400 hover:text-blue-400 transition"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-gray-400 hover:text-blue-300 transition"
            >
              <FaTwitter size={20} />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-gray-400 hover:text-blue-500 transition"
            >
              <FaLinkedinIn size={20} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-gray-400 hover:text-pink-400 transition"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} WhereIsIt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
