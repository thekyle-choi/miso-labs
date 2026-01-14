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
        // 랜딩 페이지 색상
        "background-light": "#ffffff",
        "background-dark": "#0f0f0f",
        "surface-light": "#f3f4f6",
        "surface-dark": "#1f2937",
        "accent-green": "#22c55e",
        // 홈페이지 다크 테마 색상
        dark: {
          bg: '#050505',
          surface: '#0c0c0c',
          border: '#27272a',
        },
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
        // shadcn 색상
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
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
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        kr: ["var(--font-noto-kr)", "sans-serif"],
        heading: ["var(--font-ibm-plex-kr)", "sans-serif"],
        remixicon: ["remixicon"],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
