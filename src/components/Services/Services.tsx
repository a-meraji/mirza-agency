"use client";
import { servicesEn, servicesFa } from "@/lib/data";
import ServiceSection from "./ServiceSection";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
import useSubdomain from "@/hooks/useSubdomain";

const AnimatedIcon = ({
  children,
}: {
  children: (
    progress: MotionValue<number>,
    pathLength: MotionValue<number>,
    opacity: MotionValue<number>
  ) => React.ReactNode;
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="w-full h-full">
      {children(scrollYProgress, pathLength, opacity)}
    </div>
  );
};

const icons = [
  <AnimatedIcon key="icon-1">
    {(scrollYProgress, pathLength, opacity) => (
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#f49300"
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M10 9.5 8 12l2 2.5"
          style={{
            pathLength,
            opacity,
          }}
        />
        <motion.path
          d="m14 9.5 2 2.5-2 2.5"
          style={{
            pathLength,
            opacity,
          }}
        />
        <motion.path
          d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"
          style={{
            pathLength,
            opacity,
          }}
        />
      </motion.svg>
    )}
  </AnimatedIcon>,
    <AnimatedIcon key="icon-2">
    {(scrollYProgress, pathLength, opacity) => {
      // Create custom animation timing for different parts
      const rectAnimation = useTransform(
        scrollYProgress,
        [0, 0.3, 0.5],
        [0, 0.6, 1]
      );
      
      const pathAnimation = useTransform(
        scrollYProgress,
        [0.25, 0.4, 0.5],
        [0, 0.8, 1]
      );
      
      return (
        <motion.svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f49300"
          strokeWidth="0.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.rect
            x="16"
            y="16"
            width="6"
            height="6"
            rx="1"
            style={{
              pathLength: rectAnimation,
              opacity,
            }}
          />
          <motion.rect
            x="2"
            y="16"
            width="6"
            height="6"
            rx="1"
            style={{
              pathLength: rectAnimation,
              opacity,
            }}
          />
          <motion.rect
            x="9"
            y="2"
            width="6"
            height="6"
            rx="1"
            style={{
              pathLength: rectAnimation,
              opacity,
            }}
          />
          <motion.path
            d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"
            style={{
              pathLength: pathAnimation,
              opacity,
            }}
          />
          <motion.path
            d="M12 12V8"
            style={{
              pathLength: pathAnimation,
              opacity,
            }}
          />
        </motion.svg>
      );
    }}
  </AnimatedIcon>,
  <AnimatedIcon key="icon-3">
    {(scrollYProgress, pathLength, opacity) => (
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#f49300"
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"
          style={{
            pathLength: useTransform(scrollYProgress, [0, 0.7, 1], [0, 1, 1]),
            opacity,
          }}
        />
        <motion.path
          d="M21 16v2a4 4 0 0 1-4 4h-5"
          style={{
            pathLength: useTransform(scrollYProgress, [0, 0.7, 1], [0, 1, 1]),
            opacity,
          }}
        />
      </motion.svg>
    )}
  </AnimatedIcon>,
  <AnimatedIcon key="icon-4">
    {(scrollYProgress, pathLength, opacity) => (
      <motion.svg
        width="100%"
        height="100%"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#f49300"
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M12 8V4H8"
          style={{
            pathLength,
            opacity,
          }}
        />
        <motion.rect
          width="16"
          height="12"
          x="4"
          y="8"
          rx="2"
          style={{
            pathLength,
            opacity,
          }}
        />
        <motion.path
          d="M2 14h2"
          style={{
            pathLength,
            opacity,
          }}
        />
        <motion.path
          d="M20 14h2"
          style={{
            pathLength,
            opacity,
          }}
        />
        <motion.path
          d="M15 13v2"
          style={{
            pathLength,
            opacity,
          }}
        />
        <motion.path
          d="M9 13v2"
          style={{
            pathLength,
            opacity,
          }}
        />
      </motion.svg>
    )}
  </AnimatedIcon>,

];

const Services = () => {
  const { hasFaSubdomain } = useSubdomain();
  const toBeMappedArray = hasFaSubdomain ? servicesFa : servicesEn;
  const servicesData = toBeMappedArray.map((service, index) => ({
    ...service,
    icon: icons[index],
  }));

  return (
    <section className="w-full py-16 lg:py-32">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h6
            id="services"
            className="text-4xl lg:text-5xl font-bold text-iconic titr"
          >
            {hasFaSubdomain ? "خدمات میرزا" : "Our Services"}
          </h6>
        </motion.div>

        <div className="mb-16 lg:mb-24">
          {servicesData.map((service, index) => (
            <ServiceSection
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              modalTitle={service.modalTitle}
              modalDescription={service.modalDescription}
              icon={service.icon}
              index={index}
              isReversed={index % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
