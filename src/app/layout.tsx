import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext"; // Importer ThemeProvider

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ColiSync",
  description: "Votre application de suivi de colis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={roboto.className} suppressHydrationWarning>
      {" "}
      {/* suppressHydrationWarning est utile avec le thème */}
      <body>
        <ThemeProvider>
          {" "}
          {/* Envelopper avec ThemeProvider */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
