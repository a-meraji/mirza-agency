"use client"
import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'

function Navbar() {
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  return (
    <nav className={`z-10 backdrop-blur-sm backdrop-contrast-100 backdrop-brightness-100 bg-[#462d22b4] max-w-xl mx-auto right-0 left-0 fixed top-4 rounded-full px-5 text-iconic flex items-center justify-between w-full transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
        <div className='flex pag-x-2 items-center'>
            <Image src="./logo.svg" width={55} height={55} alt="لوگو آژانس توسعه میرزا" />
            آژانس توسعه میرزا
        </div>
        <div>
            <MenuIcon />
        </div>
    </nav>
  )
}

export default Navbar