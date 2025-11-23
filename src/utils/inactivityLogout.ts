let inactivityTimer: ReturnType<typeof setTimeout> | null = null;

export const startInactivityTimer = (logoutCallback: () => void) => {
  const resetTimer = () => {
    if (inactivityTimer) clearTimeout(inactivityTimer);

    inactivityTimer = setTimeout(() => {
      logoutCallback();
    }, 10 * 60 * 1000); // 10 phút
  };

  // Sự kiện người dùng
  window.addEventListener("mousemove", resetTimer);
  window.addEventListener("keydown", resetTimer);
  window.addEventListener("click", resetTimer);

  resetTimer();
};

export const stopInactivityTimer = () => {
  if (inactivityTimer) clearTimeout(inactivityTimer);

  window.removeEventListener("mousemove", () => {});
  window.removeEventListener("keydown", () => {});
  window.removeEventListener("click", () => {});
};
