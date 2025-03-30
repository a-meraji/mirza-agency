"use client";

import React from "react";
import { motion } from "framer-motion";
import { ClipboardList, Code, MessageCircle, CheckCircle } from "lucide-react";

// Step component
const Step = ({ 
  number, 
  icon: Icon, 
  title, 
  description, 
  delay = 0 
}: { 
  number: number;
  icon: React.ElementType; 
  title: string; 
  description: string; 
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="flex gap-6 mb-12"
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-[#ffa620] text-white flex items-center justify-center font-bold text-xl">
          {number}
        </div>
      </div>
      
      <div>
        <div className="flex items-center mb-3">
          <Icon className="w-5 h-5 text-[#ffa620] mr-2" />
          <h3 className="text-xl font-semibold text-[#462d22]">{title}</h3>
        </div>
        <p className="text-[#462d22]/70 font-roboto">{description}</p>
      </div>
    </motion.div>
  );
};

export default function EnProcess() {
  // Process steps
  const steps = [
    {
      icon: ClipboardList,
      title: "Requirements Analysis",
      description: "We start by understanding your business needs and challenges. Our team works closely with you to identify the areas where AI can create the most impact for your organization."
    },
    {
      icon: Code,
      title: "Solution Development",
      description: "Our AI engineers develop tailored solutions based on your specific requirements. We use cutting-edge technologies and algorithms to build powerful, efficient systems."
    },
    {
      icon: MessageCircle,
      title: "Integration & Training",
      description: "We seamlessly integrate our AI solutions with your existing systems. Our team provides comprehensive training to ensure your staff can effectively utilize the new tools."
    },
    {
      icon: CheckCircle,
      title: "Deployment & Support",
      description: "After successful testing, we deploy the solution to your production environment. We provide ongoing support and maintenance to ensure optimal performance and continuous improvement."
    }
  ];

  return (
    <section id="process" className="py-20 bg-[#ffa620]/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#462d22] mb-4">Our Process</h2>
          <p className="text-[#462d22]/70 max-w-2xl mx-auto">
            We follow a structured methodology to deliver AI solutions that perfectly align with your business goals.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <Step
              key={index}
              number={index + 1}
              icon={step.icon}
              title={step.title}
              description={step.description}
              delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 