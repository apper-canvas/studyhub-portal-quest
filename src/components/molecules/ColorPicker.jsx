import { useState } from "react";
import { cn } from "@/utils/cn";

const ColorPicker = ({ value, onChange }) => {
  const colors = [
    "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6",
    "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className={cn(
            "w-8 h-8 rounded-full transition-all duration-200 border-2",
            value === color ? "border-gray-900 scale-110" : "border-transparent hover:scale-105"
          )}
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
};

export default ColorPicker;