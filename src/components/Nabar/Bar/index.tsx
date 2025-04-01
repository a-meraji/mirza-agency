'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { height } from '../anim';
import Body from './Body';
import { servicesFa, servicesEn } from '@/lib/data';
import useSubdomain from '@/hooks/useSubdomain';


export default function Index() {

  const [selectedLink, setSelectedLink] = useState({isActive: false, index: 0});
  const { hasFaSubdomain } = useSubdomain();
  const services = hasFaSubdomain? servicesFa: servicesEn;
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
      </div>
    </motion.div>
  )
}