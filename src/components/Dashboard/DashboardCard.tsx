import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: 'blue' | 'amber' | 'emerald' | 'orange' | 'purple' | 'rose';
  href?: string;
}

export default function DashboardCard({ title, value, icon: Icon, color, href }: DashboardCardProps) {
  // Define color variants
  const colorVariants = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      border: 'border-blue-200'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      iconBg: 'bg-amber-100',
      iconColor: 'text-iconic',
      border: 'border-amber-200'
    },
    orange: {
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      iconBg: 'bg-orange-100',
      iconColor: 'text-iconic2',
      border: 'border-orange-200'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      border: 'border-emerald-200'
    },
    purple: {
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      border: 'border-purple-200'
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      iconBg: 'bg-rose-100',
      iconColor: 'text-rose-600',
      border: 'border-rose-200'
    }
  };
  
  const { bg, text, iconBg, iconColor, border } = colorVariants[color];
  
  const CardContent = () => (
    <div className={`p-6 rounded-lg border ${border} ${bg} h-full`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${iconBg} mr-4`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={`text-2xl font-semibold ${text}`}>{value}</p>
        </div>
      </div>
    </div>
  );
  
  // Wrap with link if href is provided
  if (href) {
    return (
      <Link href={href} className="block transition-transform hover:scale-[1.02]">
        <CardContent />
      </Link>
    );
  }
  
  return <CardContent />;
} 