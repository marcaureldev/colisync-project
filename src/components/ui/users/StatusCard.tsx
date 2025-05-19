import React from "react";
import { LucideProps } from "lucide-react"; 

interface StatusCardProps {
  title: string;
  value: string | number;
  IconComponent: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  colorName: "blue" | "green" | "yellow"; 
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  IconComponent,
  colorName,
}) => {
  const colorVariants = {
    blue: {
      border: "border-blue-500 dark:border-blue-400",
      bgIcon: "bg-blue-100 dark:bg-blue-500/20",
      textIcon: "text-blue-500 dark:text-blue-400",
    },
    green: {
      border: "border-green-500 dark:border-green-400",
      bgIcon: "bg-green-100 dark:bg-green-500/20",
      textIcon: "text-green-600 dark:text-green-400",
    },
    yellow: {
      border: "border-yellow-500 dark:border-yellow-400",
      bgIcon: "bg-yellow-100 dark:bg-yellow-500/20",
      textIcon: "text-yellow-600 dark:text-yellow-400",
    },
  };

  const selectedColor = colorVariants[colorName];

  return (
    <div
      className={`bg-white dark:bg-white/5 rounded-lg shadow-md p-4 border-l-4 ${selectedColor.border}`}
    >
      <div className="flex items-center">
        <div
          className={`p-3 ${selectedColor.bgIcon} rounded-full mr-4`}
        >
          <IconComponent className={`${selectedColor.textIcon}`} size={24} />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
