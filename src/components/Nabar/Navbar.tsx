"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { AnimatePresence} from "framer-motion";
import Bar from "./Bar";
function Navbar() {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <nav
      className={`z-10 backdrop-blur-sm backdrop-contrast-100 backdrop-brightness-100 bg-[#462d22b4] max-w-xl mx-auto right-0 left-0 fixed top-4 rounded-full px-5 text-iconic flex items-center justify-between w-full transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex pag-x-2 items-center">
        <Image
          src="./logo.svg"
          width={55}
          height={55}
          alt="لوگو آژانس اتوماسیون هوشمند میرزا"
        />
        آژانس هوش مصنوعی میرزا
      </div>
      <div 
        onClick={() => {setIsActive(!isActive)}} 
        className="cursor-pointer flex items-center justify-center"
      >
        <div className={`
          w-[22.5px] relative pointer-events-none
          before:content-[''] before:h-[1px] before:w-full before:bg-[#ffa620] before:relative before:block before:transition-all before:duration-&lsqb;1500ms&rsqb; before:ease-&lsqb;cubic-bezier(0.76,0,0.24,1)&rsqb; before:top-[4px]
          after:content-[''] after:h-[1px] after:w-full after:bg-[#ffa620] after:relative after:block after:transition-all after:duration-&lsqb;1500ms&rsqb; after:ease-&lsqb;cubic-bezier(0.76,0,0.24,1)&rsqb; after:top-[-4px]
          ${isActive ? 
            'before:rotate-[-45deg] before:top-[2px] after:rotate-[45deg] after:-top-[1px]' : 
            ''
          }
        `}></div>
        <div className="absolute top-0 left-0 right-0 w-screen">
          <AnimatePresence mode="wait">
            {isActive && <Bar/>}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
