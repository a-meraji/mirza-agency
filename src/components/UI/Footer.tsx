import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-[#462d22b4] text-iconic py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p>Mirza AI Automation.  All right reserved © {new Date().getFullYear()}</p>
          </div>
          <div className="flex space-x-4 rtl:space-x-reverse">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy policy
            </Link>
            <span className="text-white mx-2">|</span>
            <Link href="/terms-of-service" className="hover:text-white transition-colors">
              Terms of service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 