import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Metrika } from "@/components/metrika";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PassPhrase",
  description:
    "Современная замена паролей с мнемоническими фразами и визуальными подсказками",
  keywords: [
    "пароли",
    "безопасность",
    "шифрование",
    "мнемонические фразы",
    "визуальные подсказки",
    "генератор паролей",
    "менеджер паролей",
    "шифрование данных",
    "безопасность данных",
    "приватность",
    "интернет-безопасность",
    "защита аккаунтов",
    "современные пароли",
    "замена паролей",
    "управление паролями",
    "безопасность онлайн",
    "шифрование паролей",
    "мнемонические пароли",
    "визуальные пароли",
    "passphrase",
    "passphrase generator",
    "passphrase manager",
    "passphrase encryption",
    "passphrase security",
    "passphrase privacy",
    "passphrase protection",
    "passphrase safety",
    "passphrase management",
    "passphrase safety tips",
    "passphrase generation",
    "passphrase best practices",
  ],
  authors: [{ name: "art3m4ik3", url: "https://ll-u.ru" }],
  robots: { index: true, follow: true },
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
    shortcut: "/favicon.ico",
  },
  openGraph: {
    title: "PassPhrase",
    description:
      "Современная замена паролей с мнемоническими фразами и визуальными подсказками",
    url: "https://passphrase.ll-u.ru",
    siteName: "passphrase.ll-u.ru",
    images: [
      {
        url: "https://passphrase.ll-u.ru/favicon.png",
        width: 1024,
        height: 1024,
        alt: "Современная замена паролей с мнемоническими фразами и визуальными подсказками",
      },
    ],
    locale: "en-US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <GoogleAnalytics gaId="G-L8J712K3Y5" />
        <Suspense>
          <Metrika />
        </Suspense>
      </body>
    </html>
  );
}
