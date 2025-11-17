import type { ReactNode, MouseEventHandler } from "react";

//UI overhaul
//create a button component with tailwindcss
type ButtonProps = {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

export default function Button({ children, onClick, className = "" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3 rounded-xl bg-green-600 text-white font-semibold 
        shadow-md hover:bg-green-700 transition ${className}`}
    >
      {children}
    </button>
  );
}
