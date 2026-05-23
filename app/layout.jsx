import "./globals.css";

export const metadata = {
  title: "Impact Creator Hub",
  description: "Creator profile tools for brand-ready collaborations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
