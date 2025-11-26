// src/hooks/useCheckout.ts
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  createBooking,
  deleteBooking,
} from "../../services/bookingServices/bookingServices.ts";
import {
  createPaymentQR,
  createPayment,
} from "../../services/paymentServices/paymentService.ts";
import { createVNPayPayment } from "../../services/paymentServices/vnpayService.ts";

export function useCheckout() {
  const [booking, setBooking] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [step, setStep] = useState<number>(1);
  const [paymentData, setPaymentData] = useState<any>(null);

  const navigate = useNavigate();
  const location = useLocation();

  // FormData
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    note: "",
    pickup: "",
    dropoff: "",
    paymentMethod: "",
  });

  // Load user + booking
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setCurrentUser(JSON.parse(userData));

    const bookingStorage = localStorage.getItem("bookingData");
    if (bookingStorage) setBooking(JSON.parse(bookingStorage));
  }, []);

  // Auto fill form khi user đã đăng nhập
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: `${currentUser.firstName || ""} ${
          currentUser.lastName || ""
        }`.trim(),
        email: currentUser.email || "",
        phone: currentUser.phoneNumber || "",
      }));
    }
  }, [currentUser]);

  // Điều hướng về từ VNPAY
  useEffect(() => {
    if (location.state?.step === 3) {
      setStep(3);
    }
  }, [location.state]);

  // FORM CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // STEP 1 → STEP 2 (Tạo booking)
  const handleNextStep1 = async () => {
    try {
      const unitPrice = Number(booking.trip?.price?.priceTrip || 0);

      const requestData = {
        userId: currentUser?.id || null,
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
            email: formData.email || null,
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

      const bookingRes = await createBooking(requestData);

      if (bookingRes.data.errCode === 0) {
        setBooking({ ...booking, id: bookingRes.data.data.id });
        setStep(2);
      } else {
        alert(bookingRes.data.errMessage);
      }
    } catch (err) {
      alert("Có lỗi khi lưu thông tin đặt vé!");
    }
  };

  // STEP 2 → STEP 3 (Thanh toán)
  const handleNextStep2 = async () => {
    try {
      if (!booking?.id) return alert("Chưa có booking!");
      if (!formData.paymentMethod)
        return alert("Vui lòng chọn phương thức thanh toán!");

      const unitPrice = Number(booking.trip?.price?.priceTrip || 0);
      const total = booking.seats.length * unitPrice;

      // BANKING: QR
      if (formData.paymentMethod === "BANKING") {
        const res = await createPaymentQR({
          bookingId: booking.id,
          amount: total,
        });

        if (res.data?.errCode === 0) {
          setPaymentData(res.data.data);
        } else alert(res.data?.errMessage);

        return;
      }

      // CASH
      if (formData.paymentMethod === "CASH") {
        const res = await createPayment({
          bookingId: booking.id,
          method: "CASH",
          amount: total,
        });

        if (res.data.errCode === 0) setStep(3);
        else alert(res.data.errMessage);

        return;
      }

      // CARD: VNPAY
      if (formData.paymentMethod === "CARD") {
        const res = await createVNPayPayment({
          bookingId: booking.id,
          amount: total,
          bankCode: "NCB",
        });

        if (res.data?.errCode === 0) {
          window.location.href = res.data.paymentUrl;
        } else {
          alert(res.data?.errMessage || "Lỗi khi tạo thanh toán VNPAY!");
        }

        return;
      }
    } catch (err: any) {
      alert(err?.response?.data?.errMessage || "Có lỗi khi tạo thanh toán!");
    }
  };

  // STEP 2 → STEP 1 (Xóa booking tạm)
  const handlePrev = async () => {
    if (step === 2 && booking?.id) {
      try {
        await deleteBooking(booking.id);
        setBooking({ ...booking, id: null });
      } catch (err) {
        console.error("Lỗi khi xóa booking:", err);
      }
    }
    setStep(step - 1);
  };

  // STEP 3: Hoàn tất
  const handleFinish = () => {
    localStorage.removeItem("bookingData");
    navigate("/");
  };

  // DOWNLOAD INVOICE
  const downloadInvoice = (bookingId: number) => {
    const link = document.createElement("a");
    link.href = `http://localhost:8080/api/v1/bookings/${bookingId}/invoice`;
    link.setAttribute("download", `invoice-${bookingId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    booking,
    step,
    setStep,
    formData,
    setFormData,
    paymentData,

    handleChange,
    handlePrev,
    handleNextStep1,
    handleNextStep2,
    handleFinish,
    downloadInvoice,
  };
}
