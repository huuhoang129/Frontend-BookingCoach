// src/utils/file.ts
/**
 * Chuyển File sang base64
 * @param file - Đối tượng File từ input
 * @returns Promise<string> (base64)
 */
export const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
