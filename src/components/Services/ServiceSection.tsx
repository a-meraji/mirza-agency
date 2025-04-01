"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/utils/motion";
import { ReactNode, useState } from "react";
import TextScrollOpacity from "../UI/TextScrollOpacity";
import Modal from "../UI/Modal";
import { Button } from "../UI/button";
import { ChevronLeft } from "lucide-react";
import { useSubdomain } from "@/hooks/useSubdomain";
interface ServiceSectionProps {
  id: string;
  title: string;
  description: string;
  modalTitle?: string;
  modalDescription?: string;
  icon: ReactNode;
  index: number;
  isReversed?: boolean;
}

const ServiceSection = ({
  id,
  title,
  description,
  modalTitle,
  modalDescription,
  icon,
  index,
  isReversed = false,
}: ServiceSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
const {hasFaSubdomain} = useSubdomain();
  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle || ""}
      >
        <div dangerouslySetInnerHTML={{ __html: modalDescription || "" }} />
      </Modal>

      <motion.div
        id={id}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className={`flex flex-col lg:flex-row items-center overflow-hidden justify-between gap-8 py-12 lg:py-20 px-4 lg:px-8 ${
          isReversed ? "lg:flex-row-reverse" : ""
        }`}
      >
        <div className={`flex-1 flex flex-col gap-4 text-center  ${hasFaSubdomain ? "lg:text-right" : "lg:text-left"}`}>
          <motion.h2
            variants={fadeIn(isReversed ? "left" : "right", index * 0.2)}
            className="text-3xl lg:text-4xl font-bold text-iconic2 titr"
          >
            {title}
          </motion.h2>
          <motion.div
            variants={fadeIn(isReversed ? "left" : "right", index * 0.2)}
            className="text-base lg:text-lg text-[#422800]/80"
          >
            <TextScrollOpacity paragraph={description} />
            {modalTitle && modalDescription && (
              <Button
                variant="ghost"
                onClick={() => setIsModalOpen(true)}
                className="mt-6 flex items-center underline gap-x-2 px-6 py-2 text-iconic2 rounded-full hover:bg-iconic2 hover:text-white transition-colors duration-300"
              >
                <ChevronLeft className="w-8 h-8" />
                {modalTitle}{" "}
              </Button>
            )}
          </motion.div>
        </div>

        <div className="flex-1 relative w-full max-w-[300px] lg:max-w-[500px] aspect-square">
          <div
            className={`absolute inset-0 ${
              isReversed ? "bg-gradient-to-l" : "bg-gradient-to-r"
            } from-transparent via-[#e9aa804b] to-transparent rounded-2xl -z-10`}
          />
          <div className="w-full h-full p-6 lg:p-8">{icon}</div>
        </div>
      </motion.div>
    </>
  );
};

export default ServiceSection;
