//UI overhaul
//create a tag component with tailwindcss
import React from "react";

type TagProps = {
  label: string;
  selected?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export function Tag({ label, selected, onClick }: TagProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium border 
        ${selected ? "bg-green-600 text-white" : "bg-green-100 text-green-700"}
        transition`}
    >
      {label}
    </button>
  );
}
