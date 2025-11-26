// utils/formatDate.ts

// Định dạng ngày
export function formatDate(
  dateString?: string | Date,
  withTime: boolean = false
): string {
  if (!dateString) return "";

  const d = new Date(dateString);
  if (isNaN(d.getTime())) return ""; // ngày không hợp lệ

  return withTime
    ? d.toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : d.toLocaleDateString("vi-VN");
}
