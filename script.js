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

const profileTitle = document.getElementById("profile-title");
const profileTitles = [
  "FULL-STACK DEVELOPER",
  "UI/UX ENGINEER",
  "QA ASSOCIATE",
  "PYTHON DEVELOPER",
];
let profileTitleIndex = 0;

if (profileTitle) {
  window.setInterval(() => {
    profileTitle.classList.add("is-changing");

    window.setTimeout(() => {
      profileTitleIndex = (profileTitleIndex + 1) % profileTitles.length;
      profileTitle.textContent = profileTitles[profileTitleIndex];
      profileTitle.classList.remove("is-changing");
    }, 220);
  }, 2600);
}

const experienceTimers = [
  {
    element: document.getElementById("experience-timer"),
    startDate: new Date(2026, 6, 1),
    getEndDate: () => new Date(),
  },
  {
    element: document.getElementById("ticer-duration"),
    startDate: new Date(2026, 1, 12),
    getEndDate: () => new Date(2026, 4, 12),
    monthsOnly: true,
  },
];
const millisecondsPerSecond = 1000;
const millisecondsPerMinute = millisecondsPerSecond * 60;
const millisecondsPerHour = millisecondsPerMinute * 60;
const millisecondsPerDay = millisecondsPerHour * 24;

const getExperienceDuration = (startDate, endDate) => {
  const cursor = new Date(startDate);
  let years = 0;
  let months = 0;

  while (new Date(cursor.getFullYear() + 1, cursor.getMonth(), 1) <= endDate) {
    cursor.setFullYear(cursor.getFullYear() + 1);
    years += 1;
  }

  while (new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1) <= endDate) {
    cursor.setMonth(cursor.getMonth() + 1);
    months += 1;
  }

  const remainingMilliseconds = Math.max(0, endDate - cursor);
  const days = Math.floor(remainingMilliseconds / millisecondsPerDay);
  const hours = Math.floor(
    (remainingMilliseconds % millisecondsPerDay) / millisecondsPerHour,
  );
  const minutes = Math.floor(
    (remainingMilliseconds % millisecondsPerHour) / millisecondsPerMinute,
  );
  const seconds = Math.floor(
    (remainingMilliseconds % millisecondsPerMinute) / millisecondsPerSecond,
  );

  return { years, months, days, hours, minutes, seconds };
};

const updateExperienceTimers = () => {
  const formatUnit = (value, unit) =>
    `${value} ${unit}${value === 1 ? "" : "s"}`;

  experienceTimers.forEach(({ element, startDate, getEndDate, monthsOnly }) => {
    if (!element) {
      return;
    }

    const duration = getExperienceDuration(startDate, getEndDate());
    const units = [
      [duration.years, "year"],
      [duration.months, "month"],
      [duration.days, "day"],
      [duration.hours, "hour"],
      [duration.minutes, "minute"],
      [duration.seconds, "second"],
    ];

    element.textContent = units
      .filter(
        ([value, unit]) =>
          (monthsOnly && unit === "month") ||
          (!monthsOnly && (unit !== "year" || value > 0)),
      )
      .map(([value, unit]) => formatUnit(value, unit))
      .join(", ");
  });
};

updateExperienceTimers();
window.setInterval(updateExperienceTimers, 1000);

const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("resume-theme");

const applyTheme = (theme) => {
  const isLight = theme === "light";
  document.body.dataset.theme = isLight ? "light" : "dark";
  themeToggle.setAttribute("aria-pressed", String(isLight));
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark mode" : "Switch to light mode",
  );
};

applyTheme(savedTheme === "light" ? "light" : "dark");

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
  applyTheme(nextTheme);
  localStorage.setItem("resume-theme", nextTheme);
  vibrate(15);
  document.body.classList.remove("theme-changing");
  requestAnimationFrame(() => document.body.classList.add("theme-changing"));
  window.setTimeout(() => vibrate([20, 40, 20]), 30);
  window.setTimeout(
    () => document.body.classList.remove("theme-changing"),
    600,
  );
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
