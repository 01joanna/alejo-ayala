import "./globals.css";
import LayoutClient from "./LayoutClient";
import AdminBar from "./components/AdminBar/AdminBar";

export const metadata = {
  title: "ALEJO AYALA",
  description: "Portfolio de Alejo Ayala",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">
        <LayoutClient>
          <AdminBar />
          {children}
        </LayoutClient>
      </body>
    </html>
  );
}
