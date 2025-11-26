// src/pages/clientPages/CheckoutPage.tsx
import "./CheckoutPage.scss";
import { Steps } from "antd";
import QRCode from "react-qr-code";
import { useCheckout } from "../../hooks/ClientHooks/useCheckoutClient.ts";

const { Step } = Steps;

export default function CheckoutPage() {
  const {
    booking,
    step,
    setStep,
    formData,
    paymentData,

    handleChange,
    handlePrev,
    handleNextStep1,
    handleNextStep2,
    handleFinish,
    downloadInvoice,
  } = useCheckout();

  if (!booking) {
    return <p>Không có dữ liệu đặt xe!</p>;
  }

  return (
    <div className="checkout-page">
      {/* Thông tin đặt vé */}
      <div className="booking-summary">
        <h3>Thông tin đặt vé</h3>

        {/* Một chiều */}
        {booking.trip && (
          <>
            <div className="trip-row-tille">
              {booking.trip.route.fromLocation.nameLocations} →{" "}
              {booking.trip.route.toLocation.nameLocations}
            </div>

            <div className="trip-row">
              <span className="label">Khởi hành:</span>
              <span className="value">{booking.trip.startTime}</span>
            </div>

            <div className="trip-row">
              <span className="label">Loại xe:</span>
              <span className="value">{booking.trip.vehicle.name}</span>
            </div>

            <div className="trip-row">
              <span className="label">Biển số xe:</span>
              <span className="value">{booking.trip.vehicle.licensePlate}</span>
            </div>

            <div className="trip-row">
              <span className="label">Ghế:</span>
              <span className="value">
                {booking.seats.map((s: any) => s.name).join(", ")}
              </span>
            </div>

            {/* Tính tổng */}
            {(() => {
              const unitPrice = Number(booking.trip?.price?.priceTrip || 0);
              const total = booking.seats.length * unitPrice;

              return (
                <div className="payment-summary">
                  <h4>Tổng thanh toán</h4>

                  <div className="trip-row">
                    <span className="label">Giá ghế chiều đi:</span>
                    <span className="value">
                      {total.toLocaleString("vi-VN")} đ
                    </span>
                  </div>

                  <div className="trip-row final">
                    <span className="label">Thanh toán:</span>
                    <span className="value">
                      {total.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>
              );
            })()}
          </>
        )}

        {/* Khứ hồi */}
        {booking.goTrip && booking.returnTrip && (
          <>
            <h4>Chiều đi</h4>
            <div className="trip-row-tille">
              {booking.goTrip.route.fromLocation.nameLocations} →{" "}
              {booking.goTrip.route.toLocation.nameLocations}
            </div>

            <div className="trip-row">
              <span className="label">Khởi hành:</span>
              <span className="value">{booking.goTrip.startTime}</span>
            </div>

            <h4>Chiều về</h4>
            <div className="trip-row-tille">
              {booking.returnTrip.route.fromLocation.nameLocations} →{" "}
              {booking.returnTrip.route.toLocation.nameLocations}
            </div>

            {(() => {
              const goPrice =
                booking.goSeats.length *
                Number(booking.goTrip?.price?.priceTrip || 0);

              const returnPrice =
                booking.returnSeats.length *
                Number(booking.returnTrip?.price?.priceTrip || 0);

              const total = goPrice + returnPrice;

              return (
                <div className="payment-summary">
                  <h4>Tổng thanh toán</h4>

                  <div className="trip-row">
                    <span className="label">Chiều đi:</span>
                    <span className="value">
                      {goPrice.toLocaleString("vi-VN")} đ
                    </span>
                  </div>

                  <div className="trip-row">
                    <span className="label">Chiều về:</span>
                    <span className="value">
                      {returnPrice.toLocaleString("vi-VN")} đ
                    </span>
                  </div>

                  <div className="trip-row final">
                    <span className="label">Thanh toán:</span>
                    <span className="value">
                      {total.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* Checkout */}
      <div className="checkout-steps">
        <Steps
          current={step - 1}
          className="step-indicator"
          labelPlacement="vertical"
        >
          <Step title="Thông tin đặt ghế" />
          <Step title="Thanh toán" />
          <Step title="Hoàn tất" />
        </Steps>

        {/* Thông tin liên hệ*/}
        {step === 1 && (
          <div className="checkout-step step-1">
            <h3 className="step-title">Thông tin liên hệ</h3>

            <div className="form-grid">
              <div className="form-group">
                <label>
                  Họ Tên <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>
                  Email <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>
                  Số Điện Thoại <span className="required">*</span>
                </label>
                <div className="phone-input">
                  <select>
                    <option>(VN) +84</option>
                  </select>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Ghi chú</label>
                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Điểm đón chi tiết</label>
                <input
                  type="text"
                  name="pickup"
                  value={formData.pickup}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Điểm trả chi tiết</label>
                <input
                  type="text"
                  name="dropoff"
                  value={formData.dropoff}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-actions">
              <button onClick={handleNextStep1} className="btn next-btn">
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {/* Thanh toán */}
        {step === 2 && (
          <div className="checkout-step step-2">
            <h3 className="step-title">Chọn hình thức thanh toán</h3>

            {/* BANKING */}
            <label
              className={`payment-option ${
                formData.paymentMethod === "BANKING" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="BANKING"
                checked={formData.paymentMethod === "BANKING"}
                onChange={handleChange}
              />
              <div className="option-content">
                <h4>Chuyển khoản ngân hàng</h4>
                <p>
                  Quét mã QR sau khi thanh toán xong admin sẽ xác nhận trong vài
                  phút.
                </p>
                <span className="fee">Miễn phí</span>
              </div>
            </label>

            {formData.paymentMethod === "BANKING" && paymentData && (
              <div className="qr-section">
                <div className="qr-left">
                  <h4>Quét mã QR</h4>
                  <QRCode value={paymentData.qrCode} size={200} />
                </div>

                <div className="qr-right">
                  <h4>Thông tin chuyển khoản</h4>
                  <p>
                    <b>Ngân hàng:</b> Vietcombank
                  </p>
                  <p>
                    <b>Số tài khoản:</b> 0123456789
                  </p>
                  <p>
                    <b>Chủ tài khoản:</b> NGUYEN VAN A
                  </p>
                  <p>
                    <b>Nội dung:</b> {paymentData.addInfo}
                  </p>

                  <button
                    className="btn next-btn"
                    onClick={() => setStep(3)}
                    style={{ marginTop: "16px" }}
                  >
                    Tôi đã thanh toán
                  </button>
                </div>
              </div>
            )}

            {/* CARD (VNPAY) */}
            <label
              className={`payment-option ${
                formData.paymentMethod === "CARD" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="CARD"
                checked={formData.paymentMethod === "CARD"}
                onChange={handleChange}
              />
              <div className="option-content">
                <h4>Thanh toán qua VNPAY</h4>
                <p>Hỗ trợ Visa, MasterCard và thẻ nội địa.</p>
                <span className="fee">Miễn phí</span>
              </div>
            </label>

            {/* CASH */}
            <label
              className={`payment-option ${
                formData.paymentMethod === "CASH" ? "active" : ""
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value="CASH"
                checked={formData.paymentMethod === "CASH"}
                onChange={handleChange}
              />
              <div className="option-content">
                <h4>Thanh toán khi lên xe</h4>
                <p>Trả tiền trực tiếp cho tài xế.</p>
                <span className="fee">Miễn phí</span>
              </div>
            </label>

            <div className="form-actions">
              <button onClick={handlePrev} className="btn prev-btn">
                Quay lại
              </button>

              {!(formData.paymentMethod === "BANKING" && paymentData) && (
                <button onClick={handleNextStep2} className="btn next-btn">
                  Tiếp tục
                </button>
              )}
            </div>
          </div>
        )}

        {/* Hoàn tất */}
        {step === 3 && (
          <div className="checkout-step step-3">
            <h3 className="step-title">Hoàn tất</h3>

            <p>
              Cảm ơn bạn <b>{formData.fullName}</b>, đơn đặt vé của bạn đã được
              ghi nhận.
            </p>
            <p>
              Chúng tôi sẽ liên hệ với bạn qua số <b>{formData.phone}</b> để xác
              nhận.
            </p>

            <div className="form-actions">
              <button
                onClick={() => downloadInvoice(booking.id)}
                className="btn next-btn"
              >
                Tải hóa đơn PDF
              </button>

              <button onClick={handleFinish} className="btn prev-btn">
                Quay lại trang chủ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
