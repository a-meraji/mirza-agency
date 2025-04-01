"use client"
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { blur } from "../../anim";
import { ListOrdered, LucideIcon } from "lucide-react";
import useSubdomain from "@/hooks/useSubdomain";
export default function Body({
  links,
  selectedLink,
  setSelectedLink,
}: {
  links: Array<{
    title: string;
    id: string;
    icon: LucideIcon;
  }>;
  selectedLink: { isActive: boolean; index: number };
  setSelectedLink: (link: { isActive: boolean; index: number }) => void;
}) {
  const { hasFaSubdomain } = useSubdomain();
  return (
    <div className="my-10 lg:my-20 bg-[#462d22b4] backdrop-blur-[10px] rounded-[10px] p-[10px] w-full h-full">
      {links.map((link, index) => {
        const { id, title } = link;
        return (
          <Link
            key={`l_${index}`}
            href={`#${id}`}
            className="text-[#ffa620] pr-[30px] lg:pr-[2vw] flex items-center gap-x-5"
          >
            <motion.span
              onMouseOver={() => {
                setSelectedLink({ isActive: true, index });
              }}
              onMouseLeave={() => {
                setSelectedLink({ isActive: false, index });
              }}
              variants={blur}
              animate={
                selectedLink.isActive && selectedLink.index != index
                  ? "open"
                  : "closed"
              }
            >
              {React.createElement(link.icon, { className: "w-10 h-10" })}
            </motion.span>
            <motion.p
              onMouseOver={() => {
                setSelectedLink({ isActive: true, index });
              }}
              onMouseLeave={() => {
                setSelectedLink({ isActive: false, index });
              }}
              variants={blur}
              animate={
                selectedLink.isActive && selectedLink.index != index
                  ? "open"
                  : "closed"
              }
              className="my-10 flex overflow-hidden text-2xl  titr"
            >
              {title}
            </motion.p>
          </Link>
        );
      })}
       <Link
            key={`l_4`}
            href={"#Process"}
            className="text-[#ffa620] pr-[30px] lg:pr-[2vw] flex items-center gap-x-5"
          >
            <motion.span
              onMouseOver={() => {
                setSelectedLink({ isActive: true, index: 4 });
              }}
              onMouseLeave={() => {
                setSelectedLink({ isActive: false, index: 4 });
              }}
              variants={blur}
              animate={
                selectedLink.isActive && selectedLink.index != 4
                  ? "open"
                  : "closed"
              }
            >
                <ListOrdered className="w-10 h-10" />
            </motion.span>
            <motion.p
              onMouseOver={() => {
                setSelectedLink({ isActive: true, index: 4 });
              }}
              onMouseLeave={() => {
                setSelectedLink({ isActive: false, index: 4 });
              }}
              variants={blur}
              animate={
                selectedLink.isActive && selectedLink.index != 4
                  ? "open"
                  : "closed"
              }
              className="my-10 flex overflow-hidden text-2xl  titr"
            >
             {hasFaSubdomain ? "مراحل کاری" : "Process"}
            </motion.p>
          </Link>
    </div>
  );
}
