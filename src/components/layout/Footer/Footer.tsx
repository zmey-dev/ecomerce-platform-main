
import React from 'react';
import { Link } from 'react-router-dom';
import { ENV } from '../../../config/env';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">MW</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                MusicWorks
              </span>
            </div>
            <p className="mt-4 text-gray-600 max-w-md">
              The leading platform for music rights registration, authorization, and monetization.
              Protect your creative works and manage your rights with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Platform
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/register-work" className="text-gray-600 hover:text-blue-600">
                  Register Work
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-600 hover:text-blue-600">
                  Search Works
                </Link>
              </li>
              <li>
                <Link to="/payments" className="text-gray-600 hover:text-blue-600">
                  Payments
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Support
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            © 2024 {ENV.APP_NAME}. All rights reserved. Version {ENV.VERSION}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
