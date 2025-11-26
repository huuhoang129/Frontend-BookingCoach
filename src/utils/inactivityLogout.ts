//src/utils/inactivityLogout.ts

let inactivityTimer: ReturnType<typeof setTimeout> | null = null;

// Bắt đầu đếm thời gian không hoạt động → tự động logout
export const startInactivityTimer = (logoutCallback: () => void) => {
  // Reset bộ đếm
  const resetTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);

    inactivityTimer = setTimeout(() => {
      logoutCallback();
    }, 10 * 60 * 1000);
  };

  // Các hành động được xem là hoạt động
  window.addEventListener("mousemove", resetTimer);
  window.addEventListener("keydown", resetTimer);
  window.addEventListener("click", resetTimer);

  resetTimer();
};

// Dừng bộ đếm khi không cần theo dõi
export const stopInactivityTimer = () => {
  if (inactivityTimer) clearTimeout(inactivityTimer);

  // Gỡ sự kiện
  window.removeEventListener("mousemove", () => {});
  window.removeEventListener("keydown", () => {});
  window.removeEventListener("click", () => {});
};
