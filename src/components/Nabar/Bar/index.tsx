'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { height } from '../anim';
import Body from './Body';
import { services } from '@/lib/data';
// import Footer from './Footer';
// import Image from './Image';

export default function Index() {

  const [selectedLink, setSelectedLink] = useState({isActive: false, index: 0});

  return (
    <motion.div 
      variants={height} 
      initial="initial" 
      animate="enter" 
      exit="exit" 
      className="overflow-hidden w-full fixed top-0 left-0 right-0"
    >
      <div className="flex gap-[50px] mb-20 lg:mb-0 lg:justify-between h-full">
        <div className="flex flex-col justify-between w-full">
          <Body links={services} selectedLink={selectedLink} setSelectedLink={setSelectedLink}/>
        </div>
        {/* <Image src={links[selectedLink.index].src} selectedLink={selectedLink}/> */}
      </div>
    </motion.div>
  )
}