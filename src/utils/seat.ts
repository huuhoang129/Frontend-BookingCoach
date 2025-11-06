// 📁 src/utils/seat.ts

/**
 * Trích xuất số ghế từ tên ghế trong DB.
 * Hỗ trợ nhiều định dạng như:
 *
 * @param name Tên ghế trong CSDL
 * @returns Số ghế (dạng chuỗi), ví dụ: "1", "2", "15"
 */
export const getSeatNumber = (name: string): string => {
  const match = name.match(/[A-Z]+(\d+)/i);
  return match ? match[1] : name;
};

/**
 * Tạo khóa duy nhất cho mỗi ghế
 * Dùng để phân biệt ghế trùng giữa các xe khác nhau
 */
export const makeSeatKey = (vehicleId: number, name: string): string => {
  return `${vehicleId}-${name}`;
};
