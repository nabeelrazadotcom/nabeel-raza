document.querySelectorAll('a[target="_blank"]').forEach((link) => {
  link.setAttribute("rel", "noopener noreferrer");
});

const vibrate = (pattern) => {
  const isTouchDevice =
    navigator.maxTouchPoints > 0 ||
    window.matchMedia?.("(pointer: coarse)").matches;

  if (isTouchDevice && typeof navigator.vibrate === "function") {
    try {
      navigator.vibrate(pattern);
    } catch {}
  }
};

const writeClipboard = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const fallback = document.createElement("textarea");
  fallback.value = text;
  fallback.setAttribute("readonly", "");
  fallback.style.position = "fixed";
  fallback.style.opacity = "0";
  document.body.appendChild(fallback);
  fallback.select();
  const copied = document.execCommand("copy");
  fallback.remove();

  if (!copied) {
    throw new Error("Clipboard access is unavailable");
  }
};

const copyToClipboard = async (pill) => {
  try {
    await writeClipboard(pill.dataset.copy);
    pill.classList.add("is-copied");
    vibrate([10, 30, 10]);

    window.setTimeout(() => {
      pill.classList.remove("is-copied");
    }, 1400);
  } catch {
    pill.classList.remove("is-copied");
  }
};

document.querySelectorAll(".copyable-pill").forEach((pill) => {
  pill.addEventListener("click", () => copyToClipboard(pill));
  pill.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      copyToClipboard(pill);
    }
  });
});

document.querySelectorAll(".social-pill").forEach((pill) => {
  pill.addEventListener("pointerenter", () => vibrate(10));
  pill.addEventListener("touchstart", () => vibrate(10), { passive: true });
  pill.addEventListener("focus", () => vibrate(10));
});

const skeletonLoader = document.getElementById("skeleton-loader");

if (skeletonLoader) {
  setTimeout(() => {
    skeletonLoader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");

    setTimeout(() => {
      skeletonLoader.remove();
    }, 450);
  }, 3000);
}
