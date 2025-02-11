"use client";

import { motion } from "framer-motion";
import { fadeIn, slideIn } from "@/utils/motion";

interface ServiceSectionProps {
  title: string;
  description: string;
  icon: string;
  index: number;
  isReversed?: boolean;
}

const ServiceSection = ({ title, description, icon, index, isReversed = false }: ServiceSectionProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      className={`flex flex-col md:flex-row items-center justify-between gap-8 py-20 ${
        isReversed ? "md:flex-row-reverse" : ""
      }`}
    >
      <motion.div
        variants={fadeIn("right", index * 0.2)}
        className="flex-1 flex flex-col gap-4"
      >
        <h2 className="text-4xl font-bold text-primary">{title}</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          {description}
        </p>
      </motion.div>

      <motion.div
        variants={slideIn(isReversed ? "left" : "right", index * 0.3)}
        className="flex-1 relative w-full aspect-square max-w-[500px]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl -z-10" />
        <img
          src={icon}
          alt={title}
          className="w-full h-full object-contain p-8"
        />
      </motion.div>
    </motion.div>
  );
};

export default ServiceSection; 