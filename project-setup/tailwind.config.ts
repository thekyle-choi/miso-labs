import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 노드 색상
        node: {
          start: "#4b4e63",
          llm: "#6366f1",
          knowledge: "#f79009",
          answer: "#31B04D",
          classifier: "#31b04d",
          condition: "#0ea5e9",
          iteration: "#E81995",
          code: "#3b82f6",
          template: "#3b82f6",
          aggregator: "#3b82f6",
          extractor: "#3b82f6",
          assigner: "#3b82f6",
          http: "#222222",
          tool: "#4b4e63",
        },
        // 상태 색상
        status: {
          success: "#31B04D",
          running: "#F79009",
          failed: "#F79009",
        },
        // 기본 색상
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        remixicon: ["remixicon"],
      },
    },
  },
  plugins: [],
};

export default config;
