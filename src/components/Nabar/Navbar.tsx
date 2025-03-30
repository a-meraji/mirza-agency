"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { AnimatePresence} from "framer-motion";
import Bar from "./Bar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

function Navbar() {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { language, changeLanguage, isRTL, t } = useLanguage();
  
  // Check if current path starts with a language prefix
  // and extract the rest of the path
  const currentPath = pathname.split('/').slice(2).join('/');
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  // Navigation links
  const navItems = [
    { href: "", label: t('home') },
    { href: "services", label: t('services') },
    { href: "blog", label: t('blog') },
    { href: "contact", label: t('contact') },
  ];
  
  // Switch language
  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'fa' : 'en');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${language}`} className="flex items-center">
            <Image 
              src="/logo.svg" 
              alt="Mirza" 
              width={50} 
              height={50} 
              className="h-10 w-auto"
            />
            <span className={`text-xl font-bold ml-2 ${language === 'fa' ? 'font-akharinkhabar' : 'font-roboto'} text-[#462d22]`}>
              {language === 'fa' ? 'میرزا' : 'Mirza'}
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={`/${language}/${item.href}`}
                className={`text-[#462d22] ${language === 'fa' ? 'font-iransans' : 'font-roboto'} hover:text-[#ffa620] transition-colors ${
                  pathname === `/${language}/${item.href}` || 
                  (item.href === "" && pathname === `/${language}`) 
                    ? "font-medium text-[#ffa620]" 
                    : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Language toggle */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center px-3 py-1.5 rounded-full bg-[#ffa620]/10 text-[#462d22] hover:bg-[#ffa620]/20 transition-colors"
            >
              <Globe className="w-4 h-4 mr-1.5" />
              <span className={language === 'fa' ? 'font-iransans' : 'font-roboto'}>
                {language === 'fa' ? 'English' : 'فارسی'}
              </span>
            </button>
          </nav>
          
          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-[#462d22] hover:text-[#ffa620] transition-colors"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t mt-2">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={`/${language}/${item.href}`}
                  className={`block py-2 text-[#462d22] ${language === 'fa' ? 'font-iransans' : 'font-roboto'} hover:text-[#ffa620] transition-colors ${
                    pathname === `/${language}/${item.href}` || 
                    (item.href === "" && pathname === `/${language}`) 
                      ? "font-medium text-[#ffa620]" 
                      : ""
                  }`}
                  onClick={toggleMenu}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Language toggle */}
              <button 
                onClick={toggleLanguage}
                className="flex items-center px-3 py-2 rounded-md bg-[#ffa620]/10 text-[#462d22] hover:bg-[#ffa620]/20 transition-colors w-fit"
              >
                <Globe className="w-4 h-4 mr-1.5" />
                <span className={language === 'fa' ? 'font-iransans' : 'font-roboto'}>
                  {language === 'fa' ? 'English' : 'فارسی'}
                </span>
              </button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
