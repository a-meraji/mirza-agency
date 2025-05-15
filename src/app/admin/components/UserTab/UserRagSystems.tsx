import { useState, useEffect } from "react";
import { PlusCircle, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/UI/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/UI/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/card";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { fetchUserRagSystems, createRagSystem } from "../../controllers/ragSystemController";

// Types for component
interface RagSystem {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

interface UserRagSystemsProps {
  userId: string;
  userName: string;
}

export default function UserRagSystems({ userId, userName }: UserRagSystemsProps) {
  const [ragSystems, setRagSystems] = useState<RagSystem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [newSystem, setNewSystem] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load user's RAG systems
  const loadRagSystems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserRagSystems(userId);
      setRagSystems(data);
    } catch (error: any) {
      console.error("Error loading RAG systems:", error);
      // Check if the error is a response error with details
      let errorMessage = 'خطای ناشناخته';
      if (error.message) {
        errorMessage = error.message;
      }
      // Check for authentication errors
      if (errorMessage.includes('Unauthorized')) {
        errorMessage = 'خطای احراز هویت: لطفاً مجدداً وارد شوید';
      }
      setError(`خطا در بارگذاری سیستم‌های RAG: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Copy ID to clipboard
  const copyToClipboard = (id: string) => {
    navigator.clipboard.writeText(id).then(
      () => {
        setCopiedId(id);
        // Reset the copied status after 2 seconds
        setTimeout(() => {
          setCopiedId(null);
        }, 1000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  };

  // Load RAG systems when component mounts
  useEffect(() => {
    if (userId) {
      loadRagSystems();
    }
  }, [userId]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSystem({ ...newSystem, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (!newSystem.name.trim()) {
        throw new Error("نام سیستم RAG الزامی است");
      }
      
      const createdSystem = await createRagSystem(userId, newSystem);
      setRagSystems([...ragSystems, createdSystem]);
      setNewSystem({ name: "", description: "" });
      setOpen(false);
    } catch (error: any) {
      console.error("Error creating RAG system:", error);
      // Check if the error is a response error with details
      let errorMessage = 'خطای ناشناخته';
      if (error.message) {
        errorMessage = error.message;
      }
      // Check for authentication errors
      if (errorMessage.includes('Unauthorized')) {
        errorMessage = 'خطای احراز هویت: لطفاً مجدداً وارد شوید';
      }
      setError(`خطا در ایجاد سیستم RAG: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">سیستم‌های RAG کاربر {userName}</h3>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              className="py-1 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              <span>افزودن سیستم RAG</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-right">ایجاد سیستم RAG جدید</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-100 text-red-800 border border-red-300 text-right">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm text-gray-700 block text-right">
                  نام سیستم <span className="text-red-500">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  value={newSystem.name}
                  onChange={handleInputChange}
                  placeholder="نام سیستم RAG را وارد کنید"
                  className="text-right"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm text-gray-700 block text-right">
                  توضیحات
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={newSystem.description}
                  onChange={handleInputChange}
                  placeholder="توضیحات سیستم RAG را وارد کنید"
                  className="text-right min-h-[120px]"
                />
              </div>
              
              <div className="flex justify-end space-x-2 space-x-reverse mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  انصراف
                </Button>
                <Button 
                  type="submit"
                  disabled={isSubmitting || !newSystem.name.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                      در حال ثبت...
                    </>
                  ) : "ثبت سیستم"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : error && ragSystems.length === 0 ? (
        <div className="p-4 rounded-lg bg-red-50 text-red-800 border border-red-200 text-right">
          {error}
        </div>
      ) : ragSystems.length === 0 ? (
        <div className="p-4 rounded-lg bg-gray-50 text-gray-500 border border-gray-200 text-center">
          کاربر هیچ سیستم RAG فعالی ندارد
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ragSystems.map(system => (
            <Card key={system.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-right">{system.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {system.description && (
                  <p className="text-sm text-gray-600 text-right mb-2">{system.description}</p>
                )}
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs text-gray-500 text-right">
                    شناسه: {system.id}
                  </p>
                  <button 
                    onClick={() => copyToClipboard(system.id)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    title="کپی شناسه"
                  >
                    {copiedId === system.id ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-right">
                  تاریخ ایجاد: {new Date(system.createdAt).toLocaleDateString('fa-IR')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 