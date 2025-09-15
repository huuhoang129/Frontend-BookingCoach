import React from "react";
import "../../styles/Button/Create.scss";

interface CreateButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

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
