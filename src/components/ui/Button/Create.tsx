import React from "react";
import "../../styles/Button/Create.scss";

// Props
interface CreateButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

// Component: CreateButton
export default function CreateButton({
  onClick,
  disabled,
  children = "Tạo mới",
}: CreateButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className="create-button">
      {children}
    </button>
  );
}
