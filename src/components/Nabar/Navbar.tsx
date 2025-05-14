"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { AnimatePresence} from "framer-motion";
import Bar from "./Bar";
import styles from './style.module.css';
import { useSubdomain } from "@/hooks/useSubdomain";
import Link from "next/link";
function Navbar() {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { hasFaSubdomain } = useSubdomain();
  
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

  
 

    return (
      <nav
        className={`z-10 backdrop-blur-sm backdrop-contrast-100 backdrop-brightness-100 bg-[#462d22b4] max-w-xl mx-auto right-0 left-0 fixed top-4 rounded-full px-5 text-iconic flex items-center justify-between w-full transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex pag-x-2 items-center">
        <Link href="/" className="flex justify-center items-center w-fit mx-auto">
        <Image
            src="/logo.svg"
            width={55}
            height={55}
            alt= {!hasFaSubdomain?"Mirza AI automation agency":"لوگو آژانس توسعه میرزا"}
          />
          {!hasFaSubdomain?"Mirza agency":"آژانس میرزا"}
          </Link>
        </div>
        <div onClick={() => {setIsActive(!isActive)}} className={styles.el}>
  
  <div className={`${styles.burger} ${isActive ? styles.burgerActive : ""} text-iconic`}></div>
  <div className="absolute top-0">
  
  <AnimatePresence mode="wait">
  
                  {isActive && <Bar/>}
  
              </AnimatePresence>
  </div>
  </div>
      </nav>
    );
}

export default Navbar;
