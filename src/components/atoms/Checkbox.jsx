import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Checkbox = forwardRef(({ 
  className,
  ...props 
}, ref) => {
  return (
    <input
      ref={ref}
      type="checkbox"
      className={cn(
        "h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer transition-all duration-200",
        className
      )}
      {...props}
    />
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;