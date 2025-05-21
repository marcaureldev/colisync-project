import React from 'react';
import { LucideProps, Package, Box, Zap } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assurez-vous que cn est importé

interface PackageTypeCardProps {
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  title: string;
  description: string;
  value: string;
  selectedValue: string;
  onSelect: (value: string) => void;
}

const PackageTypeCard: React.FC<PackageTypeCardProps> = ({
  icon: Icon,
  title,
  description,
  value,
  selectedValue,
  onSelect,
}) => {
  const isSelected = selectedValue === value;

  return (
    <div
      onClick={() => onSelect(value)}
      className={cn(
        'border rounded-lg p-4 cursor-pointer transition-all duration-200 ease-in-out relative',
        'bg-white dark:bg-white/5 hover:shadow-md',
        isSelected
          ? 'border-blue-500 ring-1 ring-blue-500 dark:border-blue-400 dark:ring-blue-400'
          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
      )}
    >
      <div className="flex items-start">
        <Icon className={cn(
          "size-7 mr-3 mt-1",
          isSelected ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
        )} />
        <div>
          <h3 className={cn(
            "font-semibold text-gray-800 dark:text-white",
            isSelected && "text-blue-600 dark:text-blue-400"
          )}>{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      {/* Indicateur de sélection (cercle radio) */}
      <div className={cn(
        "absolute top-3 right-3 w-5 h-5 border rounded-full flex items-center justify-center",
        isSelected ? "border-blue-500 bg-blue-500 dark:border-blue-400 dark:bg-blue-400" : "border-gray-400 dark:border-gray-500"
      )}>
        {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
      </div>
    </div>
  );
};

export default PackageTypeCard;