export interface CancellationUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface Cancellation {
  id: number;
  bookingCode: string;
  userId: number;
  title: string;
  reason: string;
  refundMethod: "CASH" | "BANK";
  bankName?: string | null;
  bankNumber?: string | null;
  status: "WAITING" | "APPROVED" | "REJECTED";
  adminNote?: string | null;
  user?: CancellationUser;
}
