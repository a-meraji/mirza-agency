import React, { useState, useEffect } from "react";
import { RefreshCw, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/UI/button";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from "recharts";
import PaymentFilterComponent from "./PaymentFilter";
import PaymentList from "./PaymentList";
import PaymentCreateButton from "./PaymentCreateButton";
import { Payment, PaymentFilter } from "../../models/types";
import { 
  fetchPayments, 
  filterPayments 
} from "../../controllers/paymentController";

export default function PaymentTab() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PaymentFilter>({
    startDate: "",
    endDate: "",
    userId: "",
    currency: ""
  });
  const [notification, setNotification] = useState<{
    type: 'success' | 'error',
    message: string
  } | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  // Load payments on initial mount
  useEffect(() => {
    loadPayments();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (Object.values(filters).some(val => val !== "")) {
      applyFilters(filters);
    }
  }, [filters]);

  // Process data for chart when payments change
  useEffect(() => {
    processChartData();
  }, [payments]);

  const processChartData = () => {
    if (payments.length === 0) {
      setChartData([]);
      return;
    }

    // Group payments by date
    const paymentsByDate = payments.reduce((acc, payment) => {
      const date = new Date(payment.createdAt).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = {
          date,
          totalDollar: 0,
          totalRial: 0,
          count: 0
        };
      }
      
      if (payment.currency === 'dollar') {
        acc[date].totalDollar += payment.amount;
      } else {
        acc[date].totalRial += payment.amount;
      }
      
      acc[date].count += 1;
      return acc;
    }, {} as Record<string, any>);

    // Convert to array for chart
    const chartData = Object.values(paymentsByDate).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    setChartData(chartData);
  };

  const loadPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPayments();
      setPayments(data);
      setNotification(null);
    } catch (error) {
      console.error("Error loading payments:", error);
      setError(`خطا در بارگذاری پرداخت‌ها: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`);
      setNotification({
        type: 'error',
        message: `خطا در بارگذاری پرداخت‌ها: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async (filterData: PaymentFilter) => {
    setLoading(true);
    setError(null);
    try {
      const filteredPayments = await filterPayments(filterData);
      setPayments(filteredPayments);
      setNotification(null);
    } catch (error) {
      console.error("Error applying filters:", error);
      setError(`خطا در اعمال فیلترها: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`);
      setNotification({
        type: 'error',
        message: `خطا در اعمال فیلترها: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: PaymentFilter) => {
    setFilters(newFilters);
  };

  const handlePaymentCreated = () => {
    // Show success notification
    setNotification({
      type: 'success',
      message: 'پرداخت با موفقیت ثبت شد'
    });
    
    // Refresh payments list
    loadPayments();
    
    // Auto-hide notification after 3 seconds
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#462d22] flex items-center">
          <DollarSign className="ml-2 h-5 w-5" />
          مدیریت پرداخت‌ها
        </h2>
        
        <div className="flex gap-2">
          <Button 
            onClick={loadPayments}
            className="py-2 px-3 bg-gray-100 hover:bg-gray-200 text-[#462d22] rounded-lg flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>بارگذاری مجدد</span>
          </Button>
          
          <PaymentCreateButton onSuccess={handlePaymentCreated} />
        </div>
      </div>
      
      {notification && (
        <div className={`mb-4 p-3 rounded-lg ${
          notification.type === 'error' 
            ? 'bg-red-100 text-red-800 border border-red-300' 
            : 'bg-green-100 text-green-800 border border-green-300'
        }`}>
          {notification.message}
        </div>
      )}
      
      {error && !notification && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-800 border border-red-300">
          {error}
        </div>
      )}
      
      <PaymentFilterComponent onFilter={handleFilterChange} />
      
      {chartData.length > 0 && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <Calendar className="ml-2 h-4 w-4" />
            نمودار پرداخت‌ها
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="totalDollar" 
                  name="مجموع دلار" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="totalRial" 
                  name="مجموع ریال" 
                  stroke="#82ca9d" 
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="count" 
                  name="تعداد پرداخت" 
                  stroke="#ffc658" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
      
      <PaymentList 
        payments={payments}
        loading={loading}
      />
    </>
  );
} 