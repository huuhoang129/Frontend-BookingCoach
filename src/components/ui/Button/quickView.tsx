import React from "react";
import "../../styles/Button/quickView.scss";

interface QuickViewButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function QuickViewButton({
  onClick,
  disabled,
  children = "Xem nhanh",
}: QuickViewButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className="quickview-button">
      {children}
    </button>
  );
}
