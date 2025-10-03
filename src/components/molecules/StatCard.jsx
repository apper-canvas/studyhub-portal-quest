import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, color = "primary", trend, subtitle }) => {
  const colorClasses = {
    primary: "bg-primary-100 text-primary-600",
    secondary: "bg-secondary-100 text-secondary-600",
    accent: "bg-accent-100 text-accent-600",
    success: "bg-green-100 text-green-600",
    warning: "bg-amber-100 text-amber-600",
    danger: "bg-red-100 text-red-600",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <ApperIcon name={icon} size={24} />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <ApperIcon 
              name={trend.direction === "up" ? "TrendingUp" : "TrendingDown"} 
              size={16} 
              className={trend.direction === "up" ? "text-green-600" : "text-red-600"}
            />
            <span className={`ml-1 font-medium ${trend.direction === "up" ? "text-green-600" : "text-red-600"}`}>
              {trend.value}
            </span>
            <span className="ml-1 text-gray-500">{trend.label}</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default StatCard;