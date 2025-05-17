export const defaultRates = {
  aiMessages: 0.032,
  kbWords: 1,
  fileLimitMB: 15000,
  wpPages: 375
};

export interface PricingInputs {
  aiMessages: number;
  kbWords: number;
  fileLimitMB: number;
  wpPages: number;
}

export interface PricingPlan {
  name: string;
  nameEn: string;
  monthlyPrice: number;
  monthlyPriceDollar: number;
  features: {
    aiMessages: number;
    kbWords: number;
    support: string;
    supportEn: string;
    apiAccess: string;
    apiAccessEn: string;
  };
}

export const pricingPlans: PricingPlan[] = [
  {
    name: "استارتاپ",
    nameEn: "Startup",
    monthlyPrice: 950000,
    monthlyPriceDollar: 12,
    features: {
      aiMessages: 5000, // tokens now, not messages
      kbWords: 1,
      support: "پشتیبانی پایه",
      supportEn: "Basic support",
      apiAccess: "دسترسی داشبورد",
      apiAccessEn: "Dashboard access",
    }
  },
  {
    name: "کسب و کار",
    nameEn: "Business",
    monthlyPrice: 3000000,
    monthlyPriceDollar: 40,
    features: {
      aiMessages: 20000, // tokens
      kbWords: 20,
      support: "پشتیبانی اولویت دار",
      supportEn: "Priority support",
      apiAccess: "دسترسی API + داشبورد",
      apiAccessEn: "API + Dashboard access",
    }
  },
  {
    name: "شرکتی",
    nameEn: "Company",
    monthlyPrice: 7000000,
    monthlyPriceDollar: 84,
    features: {
      aiMessages: 40000, // tokens
      kbWords: 30,
      support: "پشتیبانی اختصاصی",
      supportEn: "Dedicated support",
      apiAccess: "دسترسی API + داشبورد",
      apiAccessEn: "API + Dashboard access",
    }
  }
];


export function calculatePrice(
  inputs: PricingInputs, 
  rates: typeof defaultRates = defaultRates,
  currency: 'rial' | 'dollar' = 'rial'
): number {
  // Calculate based on message volume primarily
  const messagePrice = inputs.aiMessages * 0.032; // $0.032 per message (based on $96 for 10k)
  const kbWordsPrice = inputs.kbWords * 1; // Nominal price for KB words
  
  // Convert to Rial if needed
  if (currency === 'rial') {
    const rialToDollarRate = Number(process.env.NEXT_PUBLIC_RIAL_TO_DOLLAR_RATE) || 50000;
    return Math.round((messagePrice + kbWordsPrice) * rialToDollarRate);
  }
  
  return Math.round((messagePrice + kbWordsPrice) * 100) / 100; // Round to 2 decimal places for dollars
} 