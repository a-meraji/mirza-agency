"use client"
import React, { useState } from "react";
import { Button } from "@/components/UI/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/UI/drawer";
import { services } from "@/lib/data";

export default function ContactUs() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const handleOptionClick = (index: number) => {
    setSelectedOptions(prev => {
      // If the option is already selected, remove it
      if (prev.includes(index)) {
        return prev.filter(item => item !== index);
      } 
      // Otherwise, add it to the selected options
      else {
        return [...prev, index];
      }
    });
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="fixed bottom-[8vh] transform -translate-x-1/2 left-1/2
bg-[#fbeee0]
border-2
border-[#422800]
rounded-[30px]
shadow-[4px_4px_0_0_#422800]
text-[#422800]
cursor-pointer
font-semibold
text-[18px]
px-[18px]
leading-[50px]
text-center
no-underline
select-none
hover:bg-white
active:shadow-[2px_2px_0_0_#422800]
active:translate-y-[2px]
md:min-w-[120px]
md:px-[25px]">
          رزرو جلسه
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-[#462d22]">رزرو جلسه</h2>
            <p className="text-sm text-[#462d22]/60">
              لطفا خدمات مورد نظر خود را انتخاب کنید
            </p>
          </div>
        </DrawerHeader>
        <div className="p-4">

          <div className="grid grid-cols-2 gap-4">
            {services.map((service, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg flex items-center gap-x-1 cursor-pointer transition-all duration-300 ${
                  selectedOptions.includes(index)
                    ? "bg-[#ffa620] text-[#462d22]"
                    : "bg-[#462d22] text-[#ffa620]"
                }`}
                onClick={() => handleOptionClick(index)}
              >
                <span><service.icon/></span>
                {service.title}
              </div>
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
