// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "STRIVE - AI Solutions Platform",
  description: "Advanced AI solutions specializing in Predictive Modeling, Computer Vision, and Natural Language Processing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/svg+xml" href="/images/strive-triangle.svg" />
      </head>
      <body className={`${inter.variable} antialiased`}>
        {children}
        
        {/* Toast notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              border: '1px solid #4b5563',
              borderRadius: '12px',
              fontSize: '14px',
              padding: '12px 16px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)'
            },
            success: {
              iconTheme: {
                primary: '#f56834',
                secondary: '#ffffffeb',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#ffffffeb',
              },
            },
          }}
        />
      </body>
    </html>
  );
}