"use client";

import ServiceSection from "./ServiceSection";

const servicesData = [
  {
    title: "Design and Develop",
    description: "Transform your vision into reality with our cutting-edge design and development services. We create stunning, responsive, and user-friendly solutions that perfectly align with your brand identity and business goals.",
    icon: "/services/design.svg"
  },
  {
    title: "AI Integration",
    description: "Harness the power of artificial intelligence to revolutionize your business operations. Our AI integration services help you implement smart solutions that drive efficiency, automation, and data-driven decision making.",
    icon: "/services/ai.svg"
  },
  {
    title: "Automation and Management",
    description: "Streamline your workflows and boost productivity with our comprehensive automation and management solutions. We help you identify, implement, and optimize automated processes that save time and reduce costs.",
    icon: "/services/automation.svg"
  },
  {
    title: "Technical Support",
    description: "Get peace of mind with our reliable technical support services. Our expert team is always ready to help you maintain, troubleshoot, and optimize your systems, ensuring smooth operations around the clock.",
    icon: "/services/support.svg"
  }
];

const Services = () => {
  return (
    <section className="container mx-auto px-6 py-20">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-bold text-primary mb-6">Our Services</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Empowering your digital transformation with innovative solutions and expert support
        </p>
      </div>
      
      <div className="space-y-20">
        {servicesData.map((service, index) => (
          <ServiceSection
            key={service.title}
            {...service}
            index={index}
            isReversed={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
};

export default Services; 