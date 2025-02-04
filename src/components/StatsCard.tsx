import React from 'react';
import clsx from 'clsx';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, trend, className }) => {
  return (
    <div className={clsx("bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6", className)}>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-neutral-500 dark:text-gray-400">{title}</h3>
          <p className="text-2xl font-semibold text-neutral-900 dark:text-white mt-1">{value}</p>
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <span
            className={clsx(
              "text-sm font-medium",
              trend.isPositive 
                ? "text-green-600 dark:text-green-400" 
                : "text-red-600 dark:text-red-400"
            )}
          >
            {trend.isPositive ? "+" : "-"}{trend.value}%
          </span>
          <span className="text-sm text-neutral-500 dark:text-gray-400 ml-2">{trend.label}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
