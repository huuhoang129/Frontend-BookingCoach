import React from "react";
import "../../styles/Button/Edit.scss";

interface EditButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

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
