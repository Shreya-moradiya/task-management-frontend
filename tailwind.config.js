/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F7F84",
        "primary-dark": "#3d6468",
        "primary-light": "#e8f0f1",
        // TaskFlow exact from screenshot
        tf: {
          // Background gradient (warm off-white -> pale blue/gray)
          "bg-start": "#FDFBF8",
          "bg-end": "#F3F7FA",
          // Header
          orange: "#FF6B45",
          "orange-dark": "#FF5B37",
          label: "#A0A0A0",
          "text-dark": "#333333",
          "heading": "#2C3E50",
          "body": "#666666",
          "muted": "#888888",
          "search-bg": "#F0F0F0",
          // Summary card icons
          "icon-total": "#FF6B45",
          "icon-todo": "#3498DB",
          "icon-progress": "#FFBF00",
          "icon-done": "#00BFFF",
          // Task card priority tags
          "high-bg": "#FADEDF",
          "high-text": "#E74C3C",
          "medium-bg": "#FFEDD5",
          "medium-text": "#FFA500",
          "low-bg": "#D4E8D4",
          "low-text": "#2ECC71",
          // Task card status tags
          "todo-bg": "#D4E6F1",
          "todo-text": "#3498DB",
          "progress-bg": "#FFEDD5",
          "progress-text": "#FFA500",
          "completed-bg": "#D4E8D4",
          "completed-text": "#2ECC71",
        },
      },
      boxShadow: {
        "tf": "0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)",
        "tf-md": "0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.07)",
      },
      borderRadius: {
        "tf": "12px",
        "tf-lg": "16px",
      },
    },
  },
  plugins: [],
};
