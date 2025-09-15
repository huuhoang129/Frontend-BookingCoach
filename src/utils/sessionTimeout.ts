let logoutTimer: ReturnType<typeof setTimeout> | null = null;

export const startSessionTimeout = (logoutCallback: () => void) => {
  const resetTimer = () => {
    if (logoutTimer) clearTimeout(logoutTimer);
    logoutTimer = setTimeout(logoutCallback, 15 * 60 * 1000);
  };

  window.addEventListener("mousemove", resetTimer);
  window.addEventListener("keydown", resetTimer);
  window.addEventListener("click", resetTimer);

  resetTimer(); // start ngay
};

export const clearSessionTimeout = () => {
  if (logoutTimer) clearTimeout(logoutTimer);
  window.removeEventListener("mousemove", () => {});
  window.removeEventListener("keydown", () => {});
  window.removeEventListener("click", () => {});
};
