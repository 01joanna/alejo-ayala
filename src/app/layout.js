import "./globals.css";
import LayoutClient from "./LayoutClient";

export const metadata = {
  title: "Alejo Ayala",
  description: "Portfolio de Alejo Ayala",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
