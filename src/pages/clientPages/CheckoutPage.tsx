import { useEffect, useState } from "react";
import { Steps } from "antd";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.scss";
import QRCode from "react-qr-code";
import { createBooking } from "../../services/bookingServices/bookingServices.ts";
import { createPaymentQR } from "../../services/paymentServices/paymentService.ts";

const { Step } = Steps;

export default function CheckoutPage() {
  const [booking, setBooking] = useState<any>(null);
  const [step, setStep] = useState<number>(1);
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    note: "",
    pickup: "",
    dropoff: "",
    paymentMethod: "",
  });

  useEffect(() => {
    const data = localStorage.getItem("bookingData");
    if (data) {
      setBooking(JSON.parse(data));
    }
  }, []);

  if (!booking) {
    return <p>Không có dữ liệu đặt xe!</p>;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePrev = () => setStep(step - 1);

  // Step 1 -> Step 2
  const handleNextStep1 = async () => {
    try {
      const unitPrice = booking.trip?.price?.priceTrip
        ? Number(booking.trip.price.priceTrip)
        : 0;

      console.log("💰 Unit price (Step1):", unitPrice);

      const requestData = {
        coachTripId: booking.trip?.id,
        totalAmount: booking.seats.length * unitPrice,
        seats: booking.seats.map((s: any) => ({
          seatId: s.id,
          price: unitPrice,
        })),
        customers: [
          {
            fullName: formData.fullName,
            phone: formData.phone,
            email: null,
          },
        ],
        points: [
          ...(formData.pickup
            ? [
                {
                  type: "pickup",
                  locationId: booking.trip.route.fromLocation.id,
                  note: formData.pickup,
                },
              ]
            : []),
          ...(formData.dropoff
            ? [
                {
                  type: "dropoff",
                  locationId: booking.trip.route.toLocation.id,
                  note: formData.dropoff,
                },
              ]
            : []),
        ],
      };

      console.log("📦 Booking request data:", requestData);

      const bookingRes = await createBooking(requestData);

      console.log("✅ Booking response:", bookingRes.data);

      if (bookingRes.data.errCode === 0) {
        const newBooking = bookingRes.data.data;
        setBooking({ ...booking, id: newBooking.id });
        setStep(2);
      } else {
        alert(bookingRes.data.errMessage);
      }
    } catch (err) {
      console.error("❌ Error creating booking:", err);
      alert("Có lỗi khi lưu thông tin đặt vé!");
    }
  };

  // Step 2 -> Step 3
  const handleNextStep2 = async () => {
    try {
      if (!booking?.id) {
        alert("Chưa có booking!");
        return;
      }

      if (!formData.paymentMethod) {
        alert("Vui lòng chọn phương thức thanh toán!");
        return;
      }

      // Nếu BANKING và đã có QR thì bấm tiếp để qua step 3
      if (formData.paymentMethod === "BANKING" && paymentData) {
        setStep(3);
        return;
      }

      const unitPrice = booking.trip?.price?.priceTrip
        ? Number(booking.trip.price.priceTrip)
        : 0;
      const total = booking.seats.length * unitPrice;

      console.log("💰 Unit price (Step2):", unitPrice);
      console.log("🧾 Total amount gửi lên API:", total);

      if (formData.paymentMethod === "BANKING") {
        // gọi API tạo QR
        const res = await createPaymentQR({
          bookingId: booking.id,
          amount: total,
        });

        console.log("📨 Response createPaymentQR:", res.data);

        if (res.data.errCode === 0) {
          console.log("✅ QR Code nhận về:", res.data.data.qrCode);
          setPaymentData(res.data.data);
          // giữ step = 2, QR sẽ hiện ra
        } else {
          alert(res.data.errMessage);
        }
      } else {
        // Với CARD hoặc CASH → qua luôn step 3
        setStep(3);
      }
    } catch (err) {
      console.error("❌ Error creating payment:", err);
      alert("Có lỗi khi tạo thanh toán!");
    }
  };

  // Step 3 -> Kết thúc
  const handleFinish = () => {
    localStorage.removeItem("bookingData");
    navigate("/");
  };

  // trước khi return JSX
  if (formData.paymentMethod === "BANKING" && paymentData) {
    console.log("👉 QRCode value = ", paymentData.qrCode);
  }

  return (
    <div className="checkout-page">
      {/* ====== Phần 1: Thông tin đặt vé ====== */}
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

            {/* --- Tổng thanh toán (Một chiều) --- */}
            {(() => {
              const unitPrice = booking.trip?.price?.priceTrip
                ? Number(booking.trip.price.priceTrip)
                : 0;
              const total = booking.seats.length * unitPrice;
              const finalPay = total;
              return (
                <div className="payment-summary">
                  <h4>Tổng thanh toán</h4>
                  <div className="trip-row">
                    <span className="label">Giá ghế chiều đi:</span>
                    <span className="value">
                      {total.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="trip-row">
                    <span className="label">Tổng tiền:</span>
                    <span className="value">
                      {total.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="trip-row final">
                    <span className="label">Thanh toán:</span>
                    <span className="value">
                      {finalPay.toLocaleString("vi-VN")} đ
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
            <div className="trip-row">
              <span className="label">Loại xe:</span>
              <span className="value">{booking.goTrip.vehicle.name}</span>
            </div>
            <div className="trip-row">
              <span className="label">Biển số xe:</span>
              <span className="value">
                {booking.goTrip.vehicle.licensePlate}
              </span>
            </div>
            <div className="trip-row">
              <span className="label">Ghế:</span>
              <span className="value">
                {booking.goSeats.map((s: any) => s.name).join(", ")}
              </span>
            </div>

            <h4>Chiều về</h4>
            <div className="trip-row-tille">
              {booking.returnTrip.route.fromLocation.nameLocations} →{" "}
              {booking.returnTrip.route.toLocation.nameLocations}
            </div>
            <div className="trip-row">
              <span className="label">Khởi hành:</span>
              <span className="value">{booking.returnTrip.startTime}</span>
            </div>
            <div className="trip-row">
              <span className="label">Loại xe:</span>
              <span className="value">{booking.returnTrip.vehicle.name}</span>
            </div>
            <div className="trip-row">
              <span className="label">Biển số xe:</span>
              <span className="value">
                {booking.returnTrip.vehicle.licensePlate}
              </span>
            </div>
            <div className="trip-row">
              <span className="label">Ghế:</span>
              <span className="value">
                {booking.returnSeats.map((s: any) => s.name).join(", ")}
              </span>
            </div>

            {/* --- Tổng thanh toán (Khứ hồi) --- */}
            {(() => {
              const goPrice =
                booking.goSeats.length *
                (booking.goTrip?.price?.priceTrip
                  ? Number(booking.goTrip.price.priceTrip)
                  : 0);
              const returnPrice =
                booking.returnSeats.length *
                (booking.returnTrip?.price?.priceTrip
                  ? Number(booking.returnTrip.price.priceTrip)
                  : 0);

              const total = goPrice + returnPrice;
              const finalPay = total;

              return (
                <div className="payment-summary">
                  <h4>Tổng thanh toán</h4>
                  <div className="trip-row">
                    <span className="label">Giá ghế chiều đi:</span>
                    <span className="value">
                      {goPrice.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="trip-row">
                    <span className="label">Giá ghế chiều về:</span>
                    <span className="value">
                      {returnPrice.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                  <div className="trip-row final">
                    <span className="label">Thanh toán:</span>
                    <span className="value">
                      {finalPay.toLocaleString("vi-VN")} đ
                    </span>
                  </div>
                </div>
              );
            })()}
          </>
        )}
      </div>

      {/* ====== Phần 2: Quy trình checkout ====== */}
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
              <div></div>
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
                <label>GHI CHÚ</label>
                <input
                  type="text"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  placeholder="Ghi chú"
                />
              </div>
              <div className="form-group">
                <label>NHẬP ĐIỂM ĐÓN CHI TIẾT</label>
                <input
                  type="text"
                  name="pickup"
                  value={formData.pickup}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>NHẬP ĐIỂM TRẢ CHI TIẾT</label>
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

        {step === 2 && (
          <div className="checkout-step step-2">
            <h3 className="step-title">Chọn hình thức thanh toán</h3>

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
                <h4>Thanh toán qua chuyển khoản ngân hàng</h4>
                <p>
                  Quét mã QR hoặc chuyển khoản trực tiếp theo thông tin ngân
                  hàng của nhà xe. Admin sẽ xác nhận trong vòng 5–10 phút.
                </p>
                <span className="fee">Miễn phí dịch vụ</span>
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
                    <b>Ngân hàng:</b> Vietcombank (VCB)
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
                </div>
              </div>
            )}

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
                <h4>Thanh toán bằng thẻ</h4>
                <p>Hỗ trợ Visa, MasterCard, nội địa. An toàn, tiện lợi.</p>
                <span className="fee">Phí dịch vụ: 5.000đ</span>
              </div>
            </label>

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
                <h4>Thanh toán sau khi lên xe</h4>
                <p>Thanh toán trực tiếp cho tài xế khi lên xe.</p>
                <span className="fee">Miễn phí dịch vụ</span>
              </div>
            </label>

            <div className="form-actions">
              <button onClick={handlePrev} className="btn prev-btn">
                Quay lại
              </button>
              <button onClick={handleNextStep2} className="btn next-btn">
                Tiếp tục
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="checkout-step step-3">
            <h3 className="step-title">Hoàn tất</h3>
            <p>
              Cảm ơn bạn <b>{formData.fullName}</b>, đơn hàng của bạn đã được
              ghi nhận.
            </p>
            <p>
              Chúng tôi sẽ liên hệ qua số <b>{formData.phone}</b> để xác nhận.
            </p>
            <div className="form-actions">
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
