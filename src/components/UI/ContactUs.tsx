"use client"
import { Transition } from "@/lib/utils";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ArrowBigLeftIcon } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "What kind of service do you need?",
    options: [
      "Web Application Development",
      "UX/UI Design",
      "DevOps",
      "API Development",
    ],
  },
  {
    id: 2,
    question: "What is the scope of your project?",
    options: [
      "Small (simple website or app)",
      "Medium (website or app with several features)",
      "Large (complex platform)",
      "It needs to be checked",
    ],
  },
  {
    id: 3,
    question: "When do you need the project completed?",
    options: [
      "Within 1 month",
      "1-3 months",
      "3-6 months",
      "Flexible with the timeline",
    ],
  },
  {
    id: 4,
    question: "How did you hear about us?",
    options: ["Referral", "Social Media", "Search Engine", "Advertisement"],
  },
  {
    id: 5,
    question: "Please provide your contact details",
    isContactDetails: true,
  },
];

export default function ContactUs() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [contactDetails, setContactDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleOptionClick = (option) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: option }));
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Handle form submission here
      console.log("Form submitted with answers:", {
        ...answers,
        contactDetails,
      });
    }
  };

  const handleContactDetailChange = (e) => {
    const { name, value } = e.target;
    setContactDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactDetailsSubmit = () => {
    console.log("Form submitted with answers:", { ...answers, contactDetails });
    // Add your form submission logic here
  };

  const [showContactUs, setShowContactUs] = useState(false);
  const ContactUsHandler = () => {
    setShowContactUs(!showContactUs);
  };
  const { animationClass } = new Transition(
    showContactUs,
    "translate-y-0 scale-100 opacity-100",
    "-translate-y-24 scale-0 opacity-0"
  ).getClass();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          className="fixed bottom-[5vh] transform -translate-x-1/2 left-1/2
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
md:px-[25px]"
        >
          رزرو وقت
        </Button>
      </DrawerTrigger>
      <DrawerContent className="backdrop-blur-md bg-white/90">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader></DrawerHeader>

          <div className="max-w-lg mx-auto mb-8 py-6 px-10 bg-[#fcddb9] rounded-lg shadow-md">
            {currentQuestion < questions.length - 1 && (
              <>
                <h2 className="text-xl font-bold mb-4">
                  {questions[currentQuestion].question}
                </h2>
                <div className="space-y-4">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      className={`w-full p-4 ${answers[currentQuestion]==option? "bg-blue-100" :"bg-white"} rounded-lg hover:bg-[#ffab2d] hover:text-white transition-colors focus:outline-none`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </>
            )}
            {questions[currentQuestion].isContactDetails && (
              <>
                <h2 className="text-xl mb-4">
                  {questions[currentQuestion].question}
                </h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={contactDetails.name}
                    onChange={handleContactDetailChange}
                    className="w-full p-4 bg-[#bebebe] text-black rounded-lg"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={contactDetails.email}
                    onChange={handleContactDetailChange}
                    className="w-full p-4 bg-[#bebebe] text-black rounded-lg"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Your Phone Number"
                    value={contactDetails.phone}
                    onChange={handleContactDetailChange}
                    className="w-full p-4 bg-[#bebebe] text-black rounded-lg"
                  />
                  <button
                    onClick={handleContactDetailsSubmit}
                    className="w-full p-4 bg-[#ffab2d] text-black rounded-lg hover:bg-[#bebebe] focus:outline-none"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
           {currentQuestion > 0 && <div className="mt-4">
              <button onClick={()=>{setCurrentQuestion(pre=>pre-1)}} className="px-4 py-2 flex flex-col hover:text-accent transition-colors">
                <ArrowBigLeftIcon className="w-7 h-7" />
              </button>
          </div>}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
