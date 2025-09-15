import React, { useState } from "react";
import { Popconfirm } from "antd";
import "../../styles/Button/Delete.scss";

// Props
interface DeleteButtonProps {
  onClick?: () => void;
  onCancel?: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

// Component: DeleteButton
export default function DeleteButton({
  onClick,
  disabled,
  children = "Xoá",
}: DeleteButtonProps) {
  // Local state
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Handlers
  const showPopconfirm = () => setOpen(true);

  const handleOk = () => {
    setConfirmLoading(true);

    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
      onClick?.();
    }, 2000);
  };

  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  // Render
  return (
    <Popconfirm
      title="Bạn có chắc muốn xoá?"
      description="Thao tác này không thể hoàn tác"
      open={open}
      onConfirm={handleOk}
      okButtonProps={{ loading: confirmLoading }}
      onCancel={handleCancel}
    >
      <button
        type="button"
        onClick={showPopconfirm}
        disabled={disabled}
        className="delete-button"
      >
        {children}
      </button>
    </Popconfirm>
  );
}
