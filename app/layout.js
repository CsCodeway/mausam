import "./globals.css";

export const metadata = {
  title: "Mausam",
  description: "aapka apna mausam app",
  meta: "width=device-width, initial-scale=1, user-scalable=1, maximum-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
