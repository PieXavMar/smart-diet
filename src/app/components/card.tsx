//UI overhaul
//create a card component with tailwindcss
import React from "react";

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`bg-white shadow-lg rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}
