import React from "react";
import "../../styles/Button/quickView.scss";

// Props
interface QuickViewButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

// Component: QuickViewButton
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
