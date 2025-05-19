import type { Metadata } from "next";
import { Roboto } from "next/font/google"
// import { Geist, Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"], // Choisissez les graisses dont vous avez besoin
  subsets: ["latin"],
  display: "swap", // Améliore la performance de chargement de la police
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

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
    <html lang="en">
      <body
         className={inter.className}
      >
        {children}
      </body>
    </html>
  );
}
