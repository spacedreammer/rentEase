import React from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 py-10 px-5">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo and description */}
        <div>
          <img src="/images/logo.png" alt="Logo" className="h-10 mb-3" />
          <p className="text-sm">
            We help you find your dream home with comfort and confidence.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><a href="/" className="hover:text-blue-500">Home</a></li>
            <li><a href="/about" className="hover:text-blue-500">About Us</a></li>
            <li><a href="/contact" className="hover:text-blue-500">Contact</a></li>
            <li><a href="/team" className="hover:text-blue-500">Our Team</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <ul className="text-sm space-y-2">
            <li className="flex items-center">
              <FaPhoneAlt className="mr-2 text-blue-500" />
              +123 456 7890
            </li>
            <li className="flex items-center">
              <FaEnvelope className="mr-2 text-blue-500" />
              info@vasproperties.com
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="text-blue-600 hover:text-blue-800">
              <FaFacebookF />
            </a>
            <a href="#" className="text-pink-500 hover:text-pink-700">
              <FaInstagram />
            </a>
            <a href="#" className="text-sky-500 hover:text-sky-700">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} VaS Properties. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
