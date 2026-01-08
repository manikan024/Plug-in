import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          background: "rgba(var(--base-background), 1)",
          card: "rgba(var(--base-card), 1)",
          popover: "rgba(var(--base-popover), 1)",
          muted: "rgba(var(--base-muted), 1)",
          accent: "rgba(var(--base-accent), 1)",
          border: "rgba(var(--base-border), 1)",
          input: "rgba(var(--base-input), 1)",
          focus: "rgba(var(--base-focus-ring), 1)",
          transparent: "rgba(var(--base-background), 0.5)",
          foreground: "rgba(var(--base-foreground), 1)",
          cardForeground: "rgba(var(--base-card-foreground), 1)",
          popoverForeground: "rgba(var(--base-popover-foreground), 1)",
          mutedForeground: "rgba(var(--base-muted-foreground), 1)",
          primary: {
            DEFAULT: "rgba(var(--base-primary), 1)",
            hover: "rgba(var(--base-primary-hover), 1)",
            disable: "rgba(var(--base-primary-disable), 1)",
          },
          primaryForeground: "rgba(var(--base-primary-foreground), 1)",
          secondary: {
            DEFAULT: "rgba(var(--base-foreground), 1)",
            hover: "rgba(var(--base-secondary-hover), 1)",
            disable: "rgba(var(--base-secondary-disable), 1)",
          },
          secondaryForeground: "rgba(var(--base-secondary-foreground), 1)",
          accentForeground: "rgba(var(--base-accent-foreground), 1)",
        },
        semantic: {
          destructive: "rgba(var(--semantic-destructive), 1)",
          success: "rgba(var(--semantic-success), 1)",
          warning: "rgba(var(--semantic-warning), 1)",
          info: "rgba(var(--semantic-info), 1)",
        },
      },
    },
  },
  plugins: [animate],
};

