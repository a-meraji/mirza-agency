"use client";

import { services } from "@/lib/data";
import ServiceSection from "./ServiceSection";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

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
          d="M12 6V2H8"
          style={{
            pathLength,
            opacity,
          }}
        />
        <motion.path
          d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z"
          style={{
            pathLength,
            opacity,
          }}
        />
        <motion.path
          d="M2 12h2M9 11v2M15 11v2M20 12h2"
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
      const calendarFrame = useTransform(
        scrollYProgress,
        [0, 0.3, 0.5],
        [0, 0.6, 1]
      );
      
      const calendarLines = useTransform(
        scrollYProgress,
        [0.15, 0.35, 0.5],
        [0, 0.7, 1]
      );

      const syncArrows = useTransform(
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
          {/* Calendar frame */}
          <motion.path
            d="M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.3"
            style={{
              pathLength: calendarFrame,
              opacity,
            }}
          />
          {/* Calendar vertical lines */}
          <motion.path
            d="M16 2v4"
            style={{
              pathLength: calendarLines,
              opacity,
            }}
          />
          <motion.path
            d="M8 2v4"
            style={{
              pathLength: calendarLines,
              opacity,
            }}
          />
          <motion.path
            d="M3 10h4"
            style={{
              pathLength: calendarLines,
              opacity,
            }}
          />

          {/* Sync arrows and clock */}
          <motion.path
            d="M11 10v4h4"
            style={{
              pathLength: syncArrows,
              opacity,
            }}
          />
          <motion.path
            d="m11 14 1.535-1.605a5 5 0 0 1 8 1.5"
            style={{
              pathLength: syncArrows,
              opacity,
            }}
          />
          <motion.path
            d="m21 18-1.535 1.605a5 5 0 0 1-8-1.5"
            style={{
              pathLength: syncArrows,
              opacity,
            }}
          />
          <motion.path
            d="M21 22v-4h-4"
            style={{
              pathLength: syncArrows,
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
        <motion.rect
          width="20"
          height="20"
          x="2"
          y="2"
          rx="5"
          ry="5"
          style={{
            pathLength: useTransform(scrollYProgress, [0, 0.7, 1], [0, 1, 1]),
            opacity,
          }}
        />
        <motion.path
          d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
          style={{
            pathLength: useTransform(scrollYProgress, [0, 0.7, 1], [0, 1, 1]),
            opacity,
          }}
        />
        <motion.line
          x1="17.5"
          x2="17.51"
          y1="6.5"
          y2="6.5"
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
          d="M18 21a8 8 0 0 0-16 0"
          style={{
            pathLength,
            opacity,
          }}
        />
        <motion.circle
          cx="10"
          cy="8"
          r="5"
          style={{
            pathLength,
            opacity,
          }}
        />
        <motion.path
          d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"
          style={{
            pathLength,
            opacity,
          }}
        />
      </motion.svg>
    )}
  </AnimatedIcon>,

];

const servicesData = services.map((service, index) => ({
  ...service,
  icon: icons[index],
}));

const Services = () => {
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
            خدمات میرزا
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
