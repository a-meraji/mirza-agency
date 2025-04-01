"use client";

import { motion } from "framer-motion";
import { scrollToSection } from "@/utils/scroll";
import useSubdomain from "@/hooks/useSubdomain";
import { servicesFa, servicesEn } from "@/lib/data";
const Hero = () => {

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const titleVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  const buttonVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
    },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 30,
    },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.76, 0, 0.24, 1],
        delay: 0.8 + (i * 0.1),
      },
    }),
    hover: {
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };
  const { hasFaSubdomain } = useSubdomain();
  const services = !hasFaSubdomain? servicesEn: servicesFa;
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={`${!hasFaSubdomain?"robot":"titr"} flex flex-col justify-center items-center`}
    >
      <motion.div 
        variants={containerVariants}
        className="mt-[20vh] text-center text-iconic2"
      >
        <motion.p variants={titleVariants}>{!hasFaSubdomain?"<We Develop/>":"<ما توسعه میدهیم/>"}</motion.p>
        <motion.h1 
          variants={titleVariants}
          className="text-4xl lg:text-6xl font-bold mt-4 text-iconic"
        >
        {!hasFaSubdomain?"Unlock Efficiency with AI Automation" : "اتوماسیون هوشمند کسب و کارها"}
        </motion.h1>
        <motion.p 
          variants={titleVariants}
          className="mt-6 text-2xl"
        >
        {!hasFaSubdomain?"Transform your business operations with our cutting-edge AI solutions.":"افزایش بهره وری و کاهش هزینه ها"}
        </motion.p>
      </motion.div>

      <motion.button
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
        onClick={(e) => {
          e.preventDefault();
          scrollToSection('services');
        }}
        className="mt-10 px-8 py-2 border-2 border-iconic2 text-iconic2 bg-[#f3e0cc] rounded-full text-2xl hover:bg-iconic2 hover:text-background transition-colors duration-500"
      >
       {!hasFaSubdomain?"Mirza Services" :"خدمات میرزا"}
      </motion.button>

      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-2 justify-center items-center md:grid-cols-4 gap-4 mt-20"
      >
        {services.map((service) => (
          <motion.div
            key={service.id}
            custom={service.id}
            variants={cardVariants}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(service.id);
            }}
            whileHover="hover"
            className="flex flex-col h-full text-center justify-center items-center gap-y-2 p-5 rounded-md bg-[#e9aa804b]"
            style={{
              boxShadow: '0 4px 12px rgba(233, 170, 128, 0.2)',
            }}
          >
            {<service.icon className="w-10 h-10 text-iconic2" />}
            <span>{service.title}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default Hero;
