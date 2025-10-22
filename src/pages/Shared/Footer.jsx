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
import logo from "../../assets/logo.svg";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12 sm:py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-12 lg:gap-0">
          {/* Brand & Contact */}
          <aside className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-4 lg:w-1/4">
            <div className="flex items-center gap-2">
              <img
                src={logo}
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

          {/* Navigation Links */}
          <nav className="flex flex-col sm:flex-row justify-between flex-grow gap-8 sm:gap-12 lg:gap-16 text-sm text-gray-300">
            <div className="text-center sm:text-left">
              <h6 className="font-semibold text-white mb-4">Quick Links</h6>
              <ul className="space-y-2">
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

            <div className="text-center sm:text-left">
              <h6 className="font-semibold text-white mb-4">Support</h6>
              <ul className="space-y-2">
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

            <div className="text-center sm:text-left">
              <h6 className="font-semibold text-white mb-4">Legal</h6>
              <ul className="space-y-2">
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

        {/* Social Media */}
        <div className="mt-12 flex justify-center md:justify-end space-x-4 sm:space-x-6">
          <a
            href="#"
            aria-label="Facebook"
            className="text-gray-400 hover:text-blue-400 transition"
          >
            <FaFacebookF size={22} />
          </a>
          <a
            href="#"
            aria-label="Twitter"
            className="text-gray-400 hover:text-blue-300 transition"
          >
            <FaTwitter size={22} />
          </a>
          <a
            href="#"
            aria-label="LinkedIn"
            className="text-gray-400 hover:text-blue-500 transition"
          >
            <FaLinkedinIn size={22} />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="text-gray-400 hover:text-pink-400 transition"
          >
            <FaInstagram size={22} />
          </a>
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
