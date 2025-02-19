"use client"
import React, { useState } from "react";
import { Button } from "@/components/UI/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/UI/drawer";

export default function ContactUs() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const options = [
    "طراحی وبسایت",
    "طراحی اپلیکیشن",
    "طراحی UI/UX",
    "طراحی هویت بصری",
    "طراحی لوگو",
    "طراحی پوستر",
    "طراحی کاتالوگ",
    "طراحی بنر",
    "طراحی کارت ویزیت",
    "طراحی بروشور",
  ];

  const handleOptionClick = (index: number) => {
    setSelectedOption(index);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="bg-[#ffa620] text-[#462d22] hover:bg-[#ffa620]/90 hover:text-[#462d22]/90">
          تماس با ما
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-[#462d22]">تماس با ما</h2>
            <p className="text-sm text-[#462d22]/60">
              لطفا خدمت مورد نظر خود را انتخاب کنید
            </p>
          </div>
        </DrawerHeader>
        <div className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {options.map((option, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedOption === index
                    ? "bg-[#ffa620] text-[#462d22]"
                    : "bg-[#462d22] text-[#ffa620]"
                }`}
                onClick={() => handleOptionClick(index)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
