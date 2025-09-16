import React from "react";
import "../../styles/Button/Unlock.scss";

// Props
interface UnlockButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

// Component: UnlockButton
export default function UnlockButton({
  onClick,
  disabled,
  children = "Mở Khóa",
}: UnlockButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className="unlock-button">
      {children}
    </button>
  );
}
