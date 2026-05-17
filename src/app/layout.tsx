import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "MiBANK - Mitra Pengusaha Indonesia",
  description: "Temukan berbagai produk dan layanan MiBANK untuk memudahkan transaksi dan mengelola keuangan dengan aman dan nyaman.",
};

import { LanguageProvider } from "@/context/LanguageContext";
import { getSession, getSettings } from "./actions";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  const settings = await getSettings();

  return (
    <html lang="id">
      <body>
        <script dangerouslySetInnerHTML={{
          __html: `
            if (localStorage.getItem('mibank_admin_dark_mode') === 'true') {
              document.body.classList.add('dark-mode');
            }
          `
        }} />
        <LanguageProvider>
          <Navbar session={session} />
          <main>{children}</main>
          <Footer settings={settings} />
        </LanguageProvider>
      </body>
    </html>
  );
}
