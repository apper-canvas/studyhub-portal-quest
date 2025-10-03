import ApperIcon from "@/components/ApperIcon";

const PriorityIndicator = ({ priority }) => {
  const config = {
    high: { color: "text-red-600", bg: "bg-red-100", label: "High", icon: "AlertCircle" },
    medium: { color: "text-amber-600", bg: "bg-amber-100", label: "Medium", icon: "AlertTriangle" },
    low: { color: "text-green-600", bg: "bg-green-100", label: "Low", icon: "Info" },
  };

  const { color, bg, label, icon } = config[priority] || config.medium;

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${color}`}>
      <ApperIcon name={icon} size={12} />
      <span>{label}</span>
    </div>
  );
};

export default PriorityIndicator;