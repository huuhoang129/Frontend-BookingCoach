import React from "react";
import "../../styles/Button/Edit.scss";

// Props
interface EditButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

// Component: EditButton
export default function EditButton({
  onClick,
  disabled,
  children = "Sửa",
}: EditButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className="edit-button">
      {children}
    </button>
  );
}
