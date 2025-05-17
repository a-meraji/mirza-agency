export const defaultRates = {
  aiMessages: 750,
  kbWords: 25,
  fileLimitMB: 100000,
  knowledgeBases: 100000,
  websiteUploads: 10000,
  kbUploads: 20000,
  wpPages: 3000,
};

export interface PricingInputs {
  aiMessages: number;
  kbWords: number;
  fileLimitMB: number;
  knowledgeBases: number;
  websiteUploads: number;
  kbUploads: number;
  wpPages: number;
}

export interface PricingPlan {
  name: string;
  nameEn: string;
  monthlyPrice: number;
  features: {
    aiMessages: number;
    kbWords: number;
    fileLimitMB: number;
    knowledgeBases: number;
    websiteUploads: number;
    kbUploads: number;
    wpPages: number;
  };
  rates: {
    aiMessages: number;
    kbWords: number;
    fileLimitMB: number;
    knowledgeBases: number;
    websiteUploads: number;
    kbUploads: number;
    wpPages: number;
  };
}

export const pricingPlans: PricingPlan[] = [
  {
    name: "پلان پایه",
    nameEn: "Basic Plan",
    monthlyPrice: 900000,
    features: {
      aiMessages: 1000,
      kbWords: 10,
      fileLimitMB: 5,
      knowledgeBases: 2,
      websiteUploads: 50,
      kbUploads: 20,
      wpPages: 200
    },
    rates: {
      aiMessages: 900,
      kbWords: 90000,
      fileLimitMB: 180000,
      knowledgeBases: 450000,
      websiteUploads: 1800000,
      kbUploads: 4500000,
      wpPages: 450000
    }
  },
  {
    name: "پلان سفارشی",
    nameEn: "Custom Plan",
    monthlyPrice: 3000000,
    features: {
      aiMessages: 4000,
      kbWords: 20,
      fileLimitMB: 10,
      knowledgeBases: 8,
      websiteUploads: 200,
      kbUploads: 80,
      wpPages: 400
    },
    rates: {
      aiMessages: 750,
      kbWords: 150000,
      fileLimitMB: 300000,
      knowledgeBases: 375000,
      websiteUploads: 1500000,
      kbUploads: 3750000,
      wpPages: 750000
    }
  },
  {
    name: "پلان استاندارد",
    nameEn: "Standard Plan",
    monthlyPrice: 6000000,
    features: {
      aiMessages: 10000,
      kbWords: 40,
      fileLimitMB: 40,
      knowledgeBases: 16,
      websiteUploads: 500,
      kbUploads: 500,
      wpPages: 2000
    },
    rates: {
      aiMessages: 600,
      kbWords: 150000,
      fileLimitMB: 150000,
      knowledgeBases: 375000,
      websiteUploads: 1200000,
      kbUploads: 1200000,
      wpPages: 300000
    }
  },
  {
    name: "پلان حرفه‌ای",
    nameEn: "Professional Plan",
    monthlyPrice: 24000000,
    features: {
      aiMessages: 40000,
      kbWords: 80,
      fileLimitMB: 50,
      knowledgeBases: 20,
      websiteUploads: 1000,
      kbUploads: 1000,
      wpPages: 5000
    },
    rates: {
      aiMessages: 600,
      kbWords: 300000,
      fileLimitMB: 480000,
      knowledgeBases: 1200000,
      websiteUploads: 2400000,
      kbUploads: 2400000,
      wpPages: 480000
    }
  }
];

export function calculatePrice(
  inputs: PricingInputs, 
  rates: typeof defaultRates = defaultRates,
  currency: 'rial' | 'dollar' = 'rial'
): number {
  const total =
    inputs.aiMessages * rates.aiMessages +
    inputs.kbWords * rates.kbWords +
    inputs.fileLimitMB * rates.fileLimitMB +
    inputs.knowledgeBases * rates.knowledgeBases +
    inputs.websiteUploads * rates.websiteUploads +
    inputs.kbUploads * rates.kbUploads +
    inputs.wpPages * rates.wpPages;

  if (currency === 'dollar') {
    // Convert to dollar based on environment variable rate
    const rialToDollarRate = Number(process.env.NEXT_PUBLIC_RIAL_TO_DOLLAR_RATE) || 50000;
    return Math.round(total / rialToDollarRate * 100) / 100; // Round to 2 decimal places
  }
  
  return Math.round(total);
} 