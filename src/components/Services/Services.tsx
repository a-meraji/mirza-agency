"use client";

import ServiceSection from "./ServiceSection";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";

const AnimatedIcon = ({
  children,
}: {
  children: (progress: MotionValue<number>, pathLength: MotionValue<number>, opacity: MotionValue<number>) => React.ReactNode;
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

const DesignIcon = () => (
  <AnimatedIcon>
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
          d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="m8 6 2-2"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="m18 16 2-2"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="m15 5 4 4"
          style={{
            pathLength,
            opacity
          }}
        />
      </motion.svg>
    )}
  </AnimatedIcon>
);

const AIIcon = () => (
  <AnimatedIcon>
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
            opacity
          }}
        />
        <motion.path
          d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="M2 12h2M9 11v2M15 11v2M20 12h2"
          style={{
            pathLength,
            opacity
          }}
        />
      </motion.svg>
    )}
  </AnimatedIcon>
);

const AutomationIcon = () => (
  <AnimatedIcon>
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
          d="M11 10v4h4"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="m11 14 1.535-1.605a5 5 0 0 1 8 1.5"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="M16 2v4"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="m21 18-1.535 1.605a5 5 0 0 1-8-1.5"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="M21 22v-4h-4"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.3"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="M3 10h4"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="M8 2v4"
          style={{
            pathLength,
            opacity
          }}
        />
      </motion.svg>
    )}
  </AnimatedIcon>
);

const SupportIcon = () => (
  <AnimatedIcon>
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
          d="M12 17v4"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="m15.2 4.9-.9-.4"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="m15.2 7.1-.9.4"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="m16.9 3.2-.4-.9"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="m16.9 8.8-.4.9"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="m19.5 2.3-.4.9"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="m19.5 9.7-.4-.9"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="m21.7 4.5-.9.4"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="m21.7 7.5-.9-.4"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.path
          d="M8 21h8"
          style={{
            pathLength,
            opacity
          }}
        />
        <motion.circle
          cx="18"
          cy="6"
          r="3"
          style={{
            pathLength,
            opacity
          }}
        />
      </motion.svg>
    )}
  </AnimatedIcon>
);

const servicesData = [
  {
    id: "web-development",
    title: "طراحی و توسعه",
    description: `صفر تا صد طراحی تا راه‌اندازی فروشگاه شما. مطمئن می‌شویم که فروشگاه شما کاربرپسند، سریع و امن باشد. هدف  حفظ و افزایش فروش است`,
    modalTitle:
      "ما از سایت سازها و قالب های آماده کند و پردردسر استفاده نمی‌کنیم",
    modalDescription: `استفاده از سایت‌سازها و قالب‌های آماده، در نگاه اول شاید یک راه سریع و ارزان برای راه‌اندازی فروشگاه اینترنتی باشد، اما در بلندمدت می‌تواند به کاهش فروش منجر شود. این قالب‌ها معمولاً طراحی‌های تکراری دارند و نمی‌توانند حس اعتماد و حرفه‌ای بودن را در مشتری ایجاد کنند. وقتی یک فروشگاه ظاهری شبیه به صدها فروشگاه دیگر دارد، مشتری احساس خاص بودن نمی‌کند و احتمال خرید کاهش می‌یابد. از طرفی، این سیستم‌ها انعطاف‌پذیری کمتری دارند و امکان بهینه‌سازی برای بهبود تجربه کاربری و افزایش نرخ تبدیل (تبدیل بازدیدکننده به خریدار) در آن‌ها محدود است. همچنین، مشکلات فنی و وابستگی به پلتفرم ارائه‌دهنده می‌تواند در آینده هزینه‌های پنهانی ایجاد کند و رشد کسب‌وکار را دشوار سازد.`,
    icon: <DesignIcon />,
  },
  {
    id: "ai-solutions",
    title: "پشتیبانی هوش مصنوعی",
    description: `پشتیبانی امور مشتریان شما و تعامل با بازدید کنندگان فروشگاه تان با استفاده از هوش مصنوعی تمام خودکار در 24 ساعت شبانه روز. افزایش فروش و نرخ نگهداشت مشتری، به همراه کاهش هزینه در استخدام پشتیبان`,
    modalTitle: "وقت شما گرانبها است، همین طور وقت مشرتیانتان",
    modalDescription: `هوش مصنوعی در امور مشتریان با پاسخ‌گویی ۲۴ ساعته، سریع و دقیق، تجربه‌ای حرفه‌ای و بدون تأخیر ایجاد می‌کند که اعتماد و رضایت مشتری را افزایش می‌دهد. همچنین، با تحلیل رفتار کاربران و ارائه پیشنهادهای شخصی‌سازی‌شده، احتمال خرید و بازگشت مشتری را بیشتر کرده و نرخ نگهداشت را بهبود می‌بخشد.

در مقابل، روش‌های سنتی با تأخیر، محدودیت زمانی و خطای انسانی، باعث نارضایتی و کاهش فروش می‌شوند. در دنیای رقابتی امروز، کسب‌وکارهایی که همچنان به این روش‌ها متکی باشند، فرصت رشد و حفظ مشتریان خود را از دست خواهند داد.`,
    icon: <AIIcon />,
  },
  {
    id: "ui-design",
    title: "اتوماسیون و مدیریت",
    description: `پشت پرده سایت شما بایستی منظم و تحت مدیریت باشد. ارائه سیستم های مدیریت محصولات، سفارشات، گزارش مالی، عملکرد و فروش`,
    modalTitle: "مدیریت یک فروشگاه اینترنتی چالش برانگیز است",
    modalDescription: `نقش سیستم‌های مدیریتی در بهبود فروش و سودآوری  

سیستم‌های مدیریت محصولات، سفارشات و گزارش‌های مالی با کاهش خطا، بهینه‌سازی فرآیندها و ارائه داده‌های دقیق، مدیریت فروشگاه‌های اینترنتی را کارآمدتر می‌کنند. مدیریت یکپارچه سفارشات باعث کاهش تأخیر و بهبود تجربه مشتری شده و تحلیل‌های مالی و عملکردی تصمیم‌گیری هوشمندانه را ممکن می‌سازد.  

در مقابل، روش‌های سنتی زمان‌بر، پرخطا و ناکارآمد هستند و مانع رشد کسب‌وکار می‌شوند. در دنیای رقابتی امروز، استفاده از سیستم‌های مدیریتی یک ضرورت برای افزایش سود و موفقیت پایدار است.`,
    icon: <AutomationIcon />,
  },
  {
    id: "tech-support",
    title: "پشتیبانی فنی",
    description:
      "با خدمات پشتیبانی فنی قابل اعتماد ما، آرامش خاطر داشته باشید. تیم متخصص ما همیشه آماده است تا به شما در نگهداری، عیب یابی و بهینه سازی سیستم هایتان کمک کند و در جالش های روبه رو و توسعه های بیشتر شما را همراهی کند.",
    icon: <SupportIcon />,
  },
];

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
          <h6 id="services" className="text-4xl lg:text-5xl font-bold text-iconic titr">
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
