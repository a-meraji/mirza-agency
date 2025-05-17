'use client';

import React, { useState, useEffect } from "react";
import { calculatePrice, defaultRates, PricingInputs, pricingPlans } from "@/lib/pricingCalculator";
import useSubdomain from "@/hooks/useSubdomain";
import { dashboardTextEn, dashboardTextFa } from "@/lib/dashboard-lang";
import { TrendingUp, Check, Zap, MessageCircle, Database } from "lucide-react";

const PricingCalculator: React.FC = () => {
  const { hasFaSubdomain } = useSubdomain();
  const t = hasFaSubdomain ? dashboardTextFa : dashboardTextEn;
  
  const [inputs, setInputs] = useState<PricingInputs>({
    aiMessages: 10000,
    kbWords: 10,
    fileLimitMB: 5,
    wpPages: 200,
  });
  
  const [currency, setCurrency] = useState<'rial' | 'dollar'>(hasFaSubdomain ? 'rial' : 'dollar');
  const [activeTab, setActiveTab] = useState<'calculator' | 'plans'>('plans');
  
  // Update currency based on subdomain
  useEffect(() => {
    setCurrency(hasFaSubdomain ? 'rial' : 'dollar');
  }, [hasFaSubdomain]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: parseInt(value) || 0,
    });
  };
  
  const total = calculatePrice(inputs, defaultRates, currency);
  
  const formatCurrency = (amount: number) => {
    if (currency === 'rial') {
      return new Intl.NumberFormat(hasFaSubdomain ? 'fa-IR' : 'en-US').format(amount);
    } else {
      return new Intl.NumberFormat(hasFaSubdomain ? 'fa-IR' : 'en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    }
  };
  
  // Only use message count and KB words for the calculator
  const calculatorInputs = [
    {
      name: 'aiMessages',
      label: t.payments.aiMessages,
      icon: <MessageCircle className="h-5 w-5 text-amber-500" />,
      placeholder: hasFaSubdomain ? 'تعداد پیام‌ها' : 'Number of messages',
    },
    {
      name: 'kbWords',
      label: t.payments.kbWords,
      icon: <Database className="h-5 w-5 text-amber-500" />,
      placeholder: hasFaSubdomain ? 'میلیون کلمه ذخیره‌شده' : 'Million words indexed',
    }
  ];

  return (
    <div dir={hasFaSubdomain ? 'rtl' : 'ltr'} className={`bg-white rounded-lg shadow-md overflow-hidden ${hasFaSubdomain ? 'font-iransans' : 'robot'}`}>
      <div className="p-6 bg-amber-50 border-b border-amber-100">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <TrendingUp className={`h-5 w-5 text-amber-500 ${hasFaSubdomain ? 'ml-2' : 'mr-2'}`} />
          {t.payments.calculator}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {t.payments.calculatorDescription}
        </p>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('plans')}
          className={`flex-1 py-3 px-4 text-center font-medium ${
            activeTab === 'plans' 
              ? 'border-b-2 border-amber-500 text-amber-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {hasFaSubdomain ? 'پلان‌های قیمت' : 'Pricing Plans'}
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 py-3 px-4 text-center font-medium ${
            activeTab === 'calculator' 
              ? 'border-b-2 border-amber-500 text-amber-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {hasFaSubdomain ? 'ماشین حساب سفارشی' : 'Custom Calculator'}
        </button>
      </div>
      
      {activeTab === 'calculator' ? (
        <div className="p-6">
          {/* Currency Toggle */}
          <div className="mb-6 flex justify-end">
            <div className="inline-flex items-center rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setCurrency('rial')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  currency === 'rial'
                    ? 'bg-amber-500 text-white'
                    : 'bg-white text-gray-700 hover:text-amber-600 border border-gray-300'
                }`}
              >
                {t.payments.rial}
              </button>
              <button
                type="button"
                onClick={() => setCurrency('dollar')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  currency === 'dollar'
                    ? 'bg-amber-500 text-white'
                    : 'bg-white text-gray-700 hover:text-amber-600 border border-gray-300'
                }`}
              >
                {t.payments.dollar}
              </button>
            </div>
          </div>
        
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {calculatorInputs.map((input) => (
              <div key={input.name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 flex items-center">
                  <span className={`${hasFaSubdomain ? 'ml-2' : 'mr-2'}`}>{input.icon}</span>
                  {input.label}
                </label>
                <input
                  type="number"
                  name={input.name}
                  className="w-full p-3 border border-gray-300 rounded-lg text-right text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all bg-white"
                  value={inputs[input.name as keyof PricingInputs]}
                  onChange={handleChange}
                  min="0"
                  placeholder={input.placeholder}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex flex-col items-center">
              <span className="text-base text-gray-600">{t.payments.estimatedMonthlyPrice}</span>
              <div className="flex items-baseline mt-1">
                <span className="text-4xl font-extrabold text-amber-500">
                  {formatCurrency(total)}
                </span>
                <span className="ml-2 text-gray-500">
                  {currency === 'rial' ? 'تومان' : '$'} 
                  <span className="text-sm ml-1">{t.payments.perMonth}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6">
          {/* Currency Toggle */}
          <div className="mb-6 flex justify-end">
            <div dir="ltr" className="inline-flex items-center rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setCurrency('rial')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  currency === 'rial'
                    ? 'bg-amber-500 text-white'
                    : 'bg-white text-gray-700 hover:text-amber-600 border border-gray-300'
                }`}
              >
                {t.payments.rial}
              </button>
              <button
                type="button"
                onClick={() => setCurrency('dollar')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  currency === 'dollar'
                    ? 'bg-amber-500 text-white'
                    : 'bg-white text-gray-700 hover:text-amber-600 border border-gray-300'
                }`}
              >
                {t.payments.dollar}
              </button>
            </div>
          </div>
          
          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, index) => {
              const planPrice = currency === 'dollar' ? plan.monthlyPriceDollar : plan.monthlyPrice;
                
              return (
                <div 
                  key={index}
                  className={`border rounded-lg overflow-hidden ${
                    index === 2 ? 'border-amber-500 shadow-md' : 'border-gray-200'
                  }`}
                >
                  <div className={`p-6 ${index === 2 ? 'bg-amber-50' : 'bg-white'}`}>
                    <h3 className="text-lg font-bold">
                      {hasFaSubdomain ? plan.name : plan.nameEn}
                    </h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-extrabold text-gray-900">
                        {formatCurrency(planPrice)}
                      </span>
                      <span className="ml-1 text-sm text-gray-500">
                        {currency === 'rial' ? 'تومان' : '$'} / {t.payments.perMonth}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 border-t border-gray-200 space-y-4">
                    {/* Message Count */}
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 ${hasFaSubdomain ? 'ml-2' : 'mr-2'}`}>
                        <MessageCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="text-sm text-gray-600">
                        <span className="font-medium">
                          {plan.features.aiMessages.toLocaleString()}
                        </span>{' '}
                        {hasFaSubdomain ? 'توکن' : 'tokens'}
                      </span>
                    </div>
                    
                    {/* Words Indexed */}
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 ${hasFaSubdomain ? 'ml-2' : 'mr-2'}`}>
                        <Database className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="text-sm text-gray-600">
                        {hasFaSubdomain 
                          ? `تا ${plan.features.kbWords} میلیون کلمه ذخیره‌شده` 
                          : `Up to ${plan.features.kbWords}M words indexed`}
                      </span>
                    </div>
                    
                    {/* Support Level */}
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 ${hasFaSubdomain ? 'ml-2' : 'mr-2'}`}>
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="text-sm text-gray-600">
                        {hasFaSubdomain ? plan.features.support : plan.features.supportEn}
                      </span>
                    </div>
                    
                    {/* API Access */}
                    <div className="flex items-start">
                      <div className={`flex-shrink-0 ${hasFaSubdomain ? 'ml-2' : 'mr-2'}`}>
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="text-sm text-gray-600">
                        {hasFaSubdomain ? plan.features.apiAccess : plan.features.apiAccessEn}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingCalculator; 