import React from "react";
import "../../styles/Button/Lock.scss";

// Props
interface LockButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

// Component: LockButton
export default function LockButton({
  onClick,
  disabled,
  children = "Khóa",
}: LockButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className="lock-button">
      {children}
    </button>
  );
}
