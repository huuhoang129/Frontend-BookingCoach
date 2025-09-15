import React, { useState } from "react";
import { Popconfirm } from "antd";
import "../../styles/Button/Delete.scss";

interface DeleteButtonProps {
  onClick?: () => void; // khi xác nhận xoá
  onCancel?: () => void; // khi bấm huỷ
  disabled?: boolean;
  children?: React.ReactNode;
}

export default function DeleteButton({
  onClick,
  disabled,
  children = "Xoá",
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

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
