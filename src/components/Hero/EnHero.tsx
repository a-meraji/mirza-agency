"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function EnHero() {
  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text Content */}
          <div className="w-full md:w-1/2 mb-10 md:mb-0 md:pr-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold text-[#462d22] mb-6 font-roboto">
                AI Agency for <span className="text-[#ffa620]">Modern Businesses</span>
              </h1>
              <p className="text-lg text-[#462d22]/80 mb-8 max-w-xl">
                We provide intelligent solutions that automate and enhance your business operations. 
                From AI chatbots to process automation, we help you stay ahead in the digital era.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/en/services" 
                  className="px-8 py-3 bg-[#ffa620] text-white rounded-md shadow-md hover:bg-[#ffa620]/90 transition-all text-center font-medium"
                >
                  Our Services
                </Link>
                <Link 
                  href="/en/contact" 
                  className="px-8 py-3 border-2 border-[#462d22] text-[#462d22] rounded-md hover:bg-[#462d22]/5 transition-all text-center font-medium"
                >
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
          
          {/* Image */}
          <div className="w-full md:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full h-[400px] md:h-[500px]">
                <Image
                  src="/images/hero-en.svg"
                  alt="AI Business Solutions"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
} 