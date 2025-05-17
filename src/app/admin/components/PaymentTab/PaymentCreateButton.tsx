import { useState } from "react";
import { DollarSign, Plus } from "lucide-react";
import { Button } from "@/components/UI/button";
import { createPayment } from "../../controllers/paymentController";

interface PaymentCreateButtonProps {
  onSuccess: () => void;
}

export default function PaymentCreateButton({ onSuccess }: PaymentCreateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    user: "",
    amount: "",
    currency: "dollar"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!formData.user || !formData.amount || !formData.currency) {
        throw new Error("لطفا تمام فیلدها را پر کنید");
      }

      await createPayment({
        user: formData.user,
        amount: Number(formData.amount),
        currency: formData.currency as 'dollar' | 'rial'
      });

      // Clear form and close modal
      setFormData({
        user: "",
        amount: "",
        currency: "dollar"
      });
      setIsOpen(false);
      
      // Refresh payment list
      onSuccess();
    } catch (error) {
      console.error("Error creating payment:", error);
      setError(`خطا در ایجاد پرداخت: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="py-2 px-3 bg-[#ffa620] text-white hover:bg-[#ffa620]/90 rounded-lg flex items-center gap-1"
      >
        <Plus className="h-4 w-4" />
        <span>افزودن پرداخت جدید</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <DollarSign className="ml-2 h-5 w-5" />
                ثبت پرداخت جدید
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800 border border-red-300">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    شناسه کاربر
                  </label>
                  <input
                    type="text"
                    name="user"
                    value={formData.user}
                    onChange={handleChange}
                    placeholder="شناسه کاربر را وارد کنید"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffa620]"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    مبلغ
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    placeholder="مبلغ را وارد کنید"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffa620]"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نوع ارز
                  </label>
                  <select
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffa620]"
                    disabled={isLoading}
                  >
                    <option value="dollar">دلار</option>
                    <option value="rial">ریال</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md"
                  disabled={isLoading}
                >
                  انصراف
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2 bg-[#ffa620] text-white hover:bg-[#ffa620]/90 rounded-md mr-2"
                  disabled={isLoading}
                >
                  {isLoading ? 'در حال ثبت...' : 'ثبت پرداخت'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 