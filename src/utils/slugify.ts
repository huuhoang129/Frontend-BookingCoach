//src/utils/slugify.ts

// Chuyển chuỗi thành slug URL-friendly
export function slugify(text: string) {
  return text
    .toLowerCase() // chuyển về chữ thường
    .normalize("NFD") // tách dấu tiếng Việt
    .replace(/[\u0300-\u036f]/g, "") // xóa toàn bộ dấu
    .replace(/[^a-z0-9]+/g, "-") // thay ký tự đặc biệt bằng "-"
    .replace(/^-+|-+$/g, ""); // xóa "-" ở đầu và cuối
}
