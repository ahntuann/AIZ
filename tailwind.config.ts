import type { Config } from "tailwindcss";

const config: Config = {
  // ... (content, theme, vv... giữ nguyên)
  theme: {
    extend: {
      colors: {
        "primary-bg": "var(--primary-bg)",
        "card-bg": "var(--card-bg)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "purple-accent": "var(--purple-accent)",
        "pink-accent": "var(--pink-accent)",
        "blue-accent": "var(--blue-accent)",

        // --- THÊM CÁC MÀU MỚI TỪ ĐÂY ---
        "dimension-dark": "#111111", // Màu nền tối như ảnh mẫu
        "blur-purple-dim": "#6B62F2",
        "blur-yellow-dim": "#FFF7C0",
        "blur-pink-dim": "#E5A2FC",
        // --- HẾT PHẦN THÊM ---
      },
      backgroundImage: {
        // ... (giữ nguyên)
      },
      // ... (Phần 'animation' và 'keyframes' của bạn giữ nguyên)
    },
  },
  plugins: [],
};

export default config;
