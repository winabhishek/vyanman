
import * as React from "react";
import { motion } from "framer-motion";
import { Button, ButtonProps } from "./button";

export interface RippleButtonProps extends ButtonProps {
  rippleColor?: string;
}

const RippleButton = React.forwardRef<HTMLButtonElement, RippleButtonProps>(
  ({ className, rippleColor = "rgba(255, 255, 255, 0.35)", children, ...props }, ref) => {
    const [ripples, setRipples] = React.useState<{ id: number; x: number; y: number; size: number }[]>([]);
    
    const addRipple = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();
      
      // Calculate ripple position and size
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;
      
      // Add ripple to state
      const id = Date.now();
      setRipples([...ripples, { id, x, y, size }]);
      
      // Remove ripple after animation completes
      setTimeout(() => {
        setRipples((currentRipples) => currentRipples.filter((ripple) => ripple.id !== id));
      }, 600);
    };
    
    return (
      <Button
        ref={ref}
        className={`relative overflow-hidden ${className}`}
        {...props}
        onClick={(e) => {
          addRipple(e);
          props.onClick?.(e);
        }}
      >
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
              borderRadius: "50%",
              backgroundColor: rippleColor,
              pointerEvents: "none",
            }}
          />
        ))}
        {children}
      </Button>
    );
  }
);

RippleButton.displayName = "RippleButton";

export { RippleButton };
