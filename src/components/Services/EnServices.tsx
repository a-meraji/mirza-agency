"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, Brain, BarChart, Building2, MessageSquare, Cpu } from "lucide-react";

// Service card component
const ServiceCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-[#462d22]/10"
    >
      <div className="w-12 h-12 bg-[#ffa620]/10 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-[#ffa620]" />
      </div>
      <h3 className="text-xl font-semibold text-[#462d22] mb-3">{title}</h3>
      <p className="text-[#462d22]/70 font-roboto">{description}</p>
    </motion.div>
  );
};

export default function EnServices() {
  // Services data
  const services = [
    {
      icon: Bot,
      title: "AI Chatbots",
      description: "Intelligent customer support chatbots that learn from interactions and provide personalized assistance.",
    },
    {
      icon: Brain,
      title: "Machine Learning Solutions",
      description: "Custom ML models to predict trends, analyze data, and automate decision-making processes.",
    },
    {
      icon: MessageSquare,
      title: "Natural Language Processing",
      description: "Text analysis tools for understanding and processing language in customer communications.",
    },
    {
      icon: BarChart,
      title: "Predictive Analytics",
      description: "Data-driven insights to forecast market trends and customer behavior patterns.",
    },
    {
      icon: Building2,
      title: "Business Process Automation",
      description: "AI-powered workflow automation to streamline operations and reduce manual tasks.",
    },
    {
      icon: Cpu,
      title: "Integration Services",
      description: "Seamless integration of AI solutions with your existing business systems and platforms.",
    },
  ];

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#462d22] mb-4">Our Services</h2>
          <p className="text-[#462d22]/70 max-w-2xl mx-auto">
            We offer a comprehensive range of AI solutions designed to transform your business operations
            and enhance customer experiences.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 