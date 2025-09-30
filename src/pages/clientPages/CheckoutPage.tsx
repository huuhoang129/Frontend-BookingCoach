import { useLocation } from "react-router-dom";

export default function CheckoutPage() {
  const location = useLocation();
  const bookingData = location.state;

  console.log("Booking data:", bookingData);

  return (
    <div>
      <h2>Trang Thanh Toán</h2>
      <pre>{JSON.stringify(bookingData, null, 2)}</pre>
    </div>
  );
}
