"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/UI/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/UI/drawer";
import { servicesFa, servicesEn    } from "@/lib/data";
import { format } from "date-fns";
import fa from "date-fns/locale/fa-IR";
import { ChevronRight, ChevronLeft, Calendar, Clock, Loader2 } from "lucide-react";
import useSubdomain from "@/hooks/useSubdomain";

// Define types for the components
interface ServiceSelectionProps {
  selectedOptions: number[];
  handleOptionClick: (index: number) => void;
  goToNextStep: () => void;
}

interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
}

interface TimeSelectionProps {
  availableSlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  setSelectedSlot: (slot: TimeSlot) => void;
  goToPrevStep: () => void;
  goToNextStep: () => void;
  isLoading: boolean;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  notes?: string;
}

interface ContactFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  goToPrevStep: () => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

interface SuccessMessageProps {
  closeDrawer: () => void;
}

// Step components
const ServiceSelection = ({ selectedOptions, handleOptionClick, goToNextStep }: ServiceSelectionProps) => {
  const { hasFaSubdomain } = useSubdomain();
  const services = hasFaSubdomain? servicesFa: servicesEn;
  return (
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
    <div className="mt-6 flex justify-end">
      <Button 
        onClick={goToNextStep}
        disabled={selectedOptions.length === 0}
        className="bg-[#fbeee0] border-2 border-[#422800] rounded-[30px] shadow-[4px_4px_0_0_#422800] text-[#422800] cursor-pointer font-semibold text-[18px] px-[18px] leading-[50px] text-center no-underline select-none hover:bg-white active:shadow-[2px_2px_0_0_#422800] active:translate-y-[2px]"
      >
        {hasFaSubdomain?"مرحله بعد":"Next step"} <ChevronLeft className="mr-2 h-4 w-4" />
      </Button>
    </div>
  </div>
)};

const TimeSelection = ({ availableSlots, selectedSlot, setSelectedSlot, goToPrevStep, goToNextStep, isLoading }: TimeSelectionProps) => {
  const [groupedSlots, setGroupedSlots] = useState<Record<string, TimeSlot[]>>({});
  const { hasFaSubdomain } = useSubdomain();
  useEffect(() => {
    // Group slots by date
    const grouped = availableSlots?.reduce((acc: Record<string, TimeSlot[]>, slot: TimeSlot) => {
      const date = new Date(slot.date).toDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(slot);
      return acc;
    }, {});
    
    setGroupedSlots(grouped);
  }, [availableSlots]);
  
  return (
    <div className="flex flex-col space-y-4">
      <h2 className={`text-2xl font-semibold mb-4 ${hasFaSubdomain ? "text-right" : "text-left"}`}>{hasFaSubdomain?"زمان ملاقات را انتخاب کنید":"Select a time for your meeting"}</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="animate-spin h-8 w-8" />
          <span className="mr-2">{hasFaSubdomain?"در حال بارگذاری...":"Loading..."}</span>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSlots).map(([date, slots]) => (
            <div key={date} className="border border-[#462d22]/20 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Calendar className="h-5 w-5 text-[#ffa620] ml-2" />
                <h4 className="font-medium text-[#462d22]">
                  {format(new Date(date), 'EEEE dd MMMM yyyy', { locale: fa })}
                </h4>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot: TimeSlot) => {
                  const startTime = new Date(slot.startTime);
                  const endTime = new Date(slot.endTime);
                  const isSelected = selectedSlot && selectedSlot.id === slot.id;
                  
                  return (
                    <div
                      key={slot.id}
                      className={`p-2 rounded border flex items-center justify-center cursor-pointer transition-all ${
                        isSelected 
                          ? "bg-[#ffa620] text-[#462d22] border-[#462d22]" 
                          : "border-[#462d22]/30 hover:border-[#462d22] text-[#462d22]"
                      }`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      <Clock className="h-4 w-4 ml-1" />
                      {format(startTime, 'HH:mm')} - {format(endTime, 'HH:mm')}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-6 flex justify-between">
        <Button 
          onClick={goToPrevStep}
          className="bg-[#fbeee0] border-2 border-[#422800] rounded-[30px] shadow-[4px_4px_0_0_#422800] text-[#422800] cursor-pointer font-semibold text-[18px] px-[18px] leading-[50px] text-center no-underline select-none hover:bg-white active:shadow-[2px_2px_0_0_#422800] active:translate-y-[2px]"
        >
          <ChevronRight className="ml-2 h-4 w-4" /> {hasFaSubdomain?"مرحله قبل":"Previous step"}
        </Button>
        
        <Button 
          onClick={goToNextStep}
          disabled={!selectedSlot}
          className="bg-[#fbeee0] border-2 border-[#422800] rounded-[30px] shadow-[4px_4px_0_0_#422800] text-[#422800] cursor-pointer font-semibold text-[18px] px-[18px] leading-[50px] text-center no-underline select-none hover:bg-white active:shadow-[2px_2px_0_0_#422800] active:translate-y-[2px]"
        >
          {hasFaSubdomain?"مرحله بعد":"Next step"} <ChevronLeft className="mr-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const ContactForm = ({ formData, setFormData, goToPrevStep, handleSubmit, isSubmitting }: ContactFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const { hasFaSubdomain } = useSubdomain();
  
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-[#462d22]">{hasFaSubdomain?"اطلاعات تماس":"Contact information"}</h3>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#462d22] mb-1">{hasFaSubdomain?"نام و نام خانوادگی":"Name and surname*"}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#462d22] mb-1">{hasFaSubdomain?"ایمیل":"Email*"}</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#462d22] mb-1">{hasFaSubdomain?"شماره تماس":"Phone number*"}</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-3 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
          />
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-[#462d22] mb-1">{hasFaSubdomain?"توضیحات":"Notes"}</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-[#462d22]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffa620] focus:border-transparent"
          />
        </div>
        
        <div className="mt-6 flex justify-between">
          <Button 
            type="button"
            onClick={goToPrevStep}
            className="bg-[#fbeee0] border-2 border-[#422800] rounded-[30px] shadow-[4px_4px_0_0_#422800] text-[#422800] cursor-pointer font-semibold text-[18px] px-[18px] leading-[50px] text-center no-underline select-none hover:bg-white active:shadow-[2px_2px_0_0_#422800] active:translate-y-[2px]"
          >
            <ChevronRight className="ml-2 h-4 w-4" /> {hasFaSubdomain?"مرحله قبل":"Previous step"}
          </Button>
          
          <Button 
            type="submit"
            disabled={isSubmitting || !formData.name || !formData.email || !formData.phone}
            className="bg-[#fbeee0] border-2 border-[#422800] rounded-[30px] shadow-[4px_4px_0_0_#422800] text-[#422800] cursor-pointer font-semibold text-[18px] px-[18px] leading-[50px] text-center no-underline select-none hover:bg-white active:shadow-[2px_2px_0_0_#422800] active:translate-y-[2px]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                {hasFaSubdomain ? "در حال ثبت..." : "Submitting..."}
              </>
            ) : (
              hasFaSubdomain ? "ثبت جلسه" : "Submit appointment"
            )}
          </Button>
        </div>
      </form>
    </ div>
  );
};

const SuccessMessage = ({ closeDrawer }: SuccessMessageProps) => {
  const { hasFaSubdomain } = useSubdomain();
  return (
    <div className="p-4 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h3 className="text-xl font-bold text-[#462d22] mb-2">{hasFaSubdomain?"جلسه با موفقیت ثبت شد":"Appointment successfully booked"}</h3>
      <p className="text-[#462d22]/70 mb-6">{hasFaSubdomain?"از انتخاب ما متشکریم. به زودی با شما تماس خواهیم گرفت.":"Thank you for choosing us. We will contact you soon."}</p>
      
      <Button 
        onClick={closeDrawer}
        className="bg-[#fbeee0] border-2 border-[#422800] rounded-[30px] shadow-[4px_4px_0_0_#422800] text-[#422800] cursor-pointer font-semibold text-[18px] px-[18px] leading-[50px] text-center no-underline select-none hover:bg-white active:shadow-[2px_2px_0_0_#422800] active:translate-y-[2px]"
      >
        {hasFaSubdomain?"بستن":"Close"} 
      </Button>
    </div>
  );
};

const ContactUs = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const { hasFaSubdomain } = useSubdomain();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  const handleOptionClick = (index: number) => {
    setSelectedOptions(prev => {
      if (prev.includes(index)) {
        return prev.filter(item => item !== index);
      } 
      return [...prev, index];
    });
  };

  const goToNextStep = () => {
    if (currentStep === 1) {
      fetchAvailableSlots();
    }
    setCurrentStep(prev => prev + 1);
  };

  const goToPrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const fetchAvailableSlots = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/appointments');
      const data = await response.json();
      setAvailableSlots(data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSlot) return;
    
    try {
      setIsSubmitting(true);
      
      const toBeMappedArray = hasFaSubdomain ? servicesFa : servicesEn;
      const selectedServicesNames = selectedOptions.map(index => toBeMappedArray[index].title);
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          appointmentId: selectedSlot.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes,
          selectedServices: selectedServicesNames,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setBookingSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          notes: ''
        });
        setSelectedOptions([]);
        setSelectedSlot(null);
      }
    } catch (error) {
      console.error('Error booking meeting:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeDrawer = () => {
    setIsOpen(false);
    setTimeout(() => {
      setCurrentStep(1);
      setBookingSuccess(false);
    }, 300);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button className="fixed bottom-[8vh] transform -translate-x-1/2 left-1/2 bg-[#fbeee0] border-2 border-[#422800] rounded-[30px] shadow-[4px_4px_0_0_#422800] text-[#422800] cursor-pointer font-semibold text-[18px] px-[18px] leading-[50px] text-center no-underline select-none hover:bg-white active:shadow-[2px_2px_0_0_#422800] active:translate-y-[2px] md:min-w-[120px] md:px-[25px]">
          {hasFaSubdomain ? "رزرو جلسه" : "Book a Meeting"}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <div className="flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold text-[#462d22]">{hasFaSubdomain ? "رزرو جلسه" : "Book a Meeting"}</h2>
            {!bookingSuccess && (
              <div className="flex items-center justify-center mt-2 mb-4">
                <div className={`w-3 h-3 rounded-full mx-1 ${currentStep === 1 ? 'bg-[#ffa620]' : 'bg-[#462d22]/20'}`} />
                <div className={`w-3 h-3 rounded-full mx-1 ${currentStep === 2 ? 'bg-[#ffa620]' : 'bg-[#462d22]/20'}`} />
                <div className={`w-3 h-3 rounded-full mx-1 ${currentStep === 3 ? 'bg-[#ffa620]' : 'bg-[#462d22]/20'}`} />
              </div>
            )}
          </div>
        </DrawerHeader>
        
        {bookingSuccess ? (
          <SuccessMessage closeDrawer={closeDrawer} />
        ) : (
          <div className="px-4">
            {currentStep === 1 && (
              <>
                <p className="text-sm text-[#462d22]/60 text-center mb-4">
                  {hasFaSubdomain ? "لطفا خدمات مورد نظر خود را انتخاب کنید" : "Please select the services you're interested in"}
                </p>
                <ServiceSelection 
                  selectedOptions={selectedOptions} 
                  handleOptionClick={handleOptionClick} 
                  goToNextStep={goToNextStep} 
                />
              </>
            )}
            
            {currentStep === 2 && (
              <TimeSelection
                availableSlots={availableSlots}
                selectedSlot={selectedSlot}
                setSelectedSlot={setSelectedSlot}
                goToPrevStep={goToPrevStep}
                goToNextStep={goToNextStep}
                isLoading={isLoading}
              />
            )}
            
            {currentStep === 3 && (
              <ContactForm 
                formData={formData}
                setFormData={setFormData}
                goToPrevStep={goToPrevStep}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

export default ContactUs; 