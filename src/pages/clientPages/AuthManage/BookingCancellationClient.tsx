import { useState } from "react";
import { Form, Input, Radio, Button } from "antd";
import { useNavigate } from "react-router-dom";
import ProfileSidebar from "../../../components/Sider/ProfileSidebar";
import requestAPI from "../../../api/requestAPI";
import { AppNotification } from "../../../components/Notification/AppNotification";
import "./BookingCancellationClient.scss";

export default function BookingCancellationPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { contextHolder, notifySuccess, notifyError } = AppNotification();
  const [refundMethod, setRefundMethod] = useState<"CASH" | "BANK">("CASH");
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        bookingCode: values.bookingCode,
        userId: user?.id,
        title: values.title,
        reason: values.reason,
        refundMethod: refundMethod,
        bankName: refundMethod === "BANK" ? values.bankName : null,
        bankNumber: refundMethod === "BANK" ? values.bankNumber : null,
      };
      const res = await requestAPI.post("/booking-cancellations", payload);
      if (res.data.errCode === 0) {
        notifySuccess(
          "Gửi yêu cầu thành công!",
          "Yêu cầu hủy vé đã được gửi đến quản trị viên."
        );
        form.resetFields();
        setRefundMethod("CASH");
      } else {
        notifyError(
          "Gửi yêu cầu thất bại",
          res.data.errMessage || "Vui lòng thử lại."
        );
      }
    } catch (error) {
      notifyError("Lỗi hệ thống", "Không thể kết nối tới server.");
    }
  };

  return (
    <div className="profile-container">
      {/* ContextHolder */}
      {contextHolder}

      <ProfileSidebar
        activeTab="cancellation"
        onChangeTab={(tab) => navigate(`/profile/${tab}`)}
      />

      <div className="main-content">
        <div className="cancellation-wrapper">
          <div className="cancellation-card">
            <h2 className="title">Yêu cầu hủy vé</h2>
            <p className="desc">
              Vui lòng điền thông tin để gửi yêu cầu hủy vé.
            </p>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleSubmit}
              className="cancellation-form"
            >
              <Form.Item
                name="bookingCode"
                label="Mã Booking"
                rules={[
                  { required: true, message: "Vui lòng nhập mã booking" },
                ]}
              >
                <Input placeholder="VD: BKG123456" />
              </Form.Item>
              <Form.Item
                name="title"
                label="Tiêu đề"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
              >
                <Input placeholder="VD: Muốn hủy vé" />
              </Form.Item>
              <Form.Item
                name="reason"
                label="Lý do hủy"
                rules={[{ required: true, message: "Vui lòng nhập lý do" }]}
              >
                <Input.TextArea
                  rows={4}
                  placeholder="VD: Công việc đột xuất..."
                />
              </Form.Item>
              <Form.Item label="Phương thức hoàn tiền">
                <Radio.Group
                  value={refundMethod}
                  onChange={(e) => setRefundMethod(e.target.value)}
                  className="refund-method"
                >
                  <Radio value="CASH">Không hoàn tiền (CASH)</Radio>
                  <Radio value="BANK">Hoàn tiền qua ngân hàng</Radio>
                </Radio.Group>
              </Form.Item>
              {refundMethod === "BANK" && (
                <>
                  <Form.Item
                    name="bankName"
                    label="Tên ngân hàng"
                    rules={[{ required: true, message: "Nhập tên ngân hàng" }]}
                  >
                    <Input placeholder="VD: Vietcombank" />
                  </Form.Item>
                  <Form.Item
                    name="bankNumber"
                    label="Số tài khoản"
                    rules={[{ required: true, message: "Nhập số tài khoản" }]}
                  >
                    <Input placeholder="VD: 0123456789" />
                  </Form.Item>
                </>
              )}
              <div className="actions">
                <Button type="primary" htmlType="submit" className="submit-btn">
                  Gửi yêu cầu
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
