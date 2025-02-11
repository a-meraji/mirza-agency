import { MenuIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

function Navbar() {
  return (
    <nav className=' backdrop-blur-sm backdrop-contrast-100 backdrop-brightness-100 bg-[#462d22b4] max-w-xl mx-auto right-0 left-0  fixed top-4 rounded-full px-5 text-iconic flex items-center justify-between w-full'>
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