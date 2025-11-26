// src/utils/seat.ts

// Lấy số ghế từ tên ghế trong DB
export const getSeatNumber = (name: string): string => {
  const match = name.match(/[A-Z]+(\d+)/i);
  return match ? match[1] : name;
};

// Tạo key duy nhất cho ghế theo từng xe
export const makeSeatKey = (vehicleId: number, name: string): string => {
  return `${vehicleId}-${name}`;
};
