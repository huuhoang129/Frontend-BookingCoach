//src/utils/string.ts

// Viết hoa ký tự đầu của chuỗi, trả về chuỗi rỗng nếu đầu vào không hợp lệ
export function capitalizeFirst(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
