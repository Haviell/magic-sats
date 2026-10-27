import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat } from 'next/font/google';
import "./globals.css";
import { RaffleProvider } from '@/context/raffle-context'
import NavigationBar from "@/components/NavigationBar";
import AboutModalTrigger from "@/components/AboutModalTrigger";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "MagicSats ✨ Rifa de Bitcoin",
  description: "A primeira rifa de Bitcoin 100% transparente do Brasil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} font-sans antialiased`}
      >
        <RaffleProvider>
          <NavigationBar />
          {children}
        </RaffleProvider>
        <footer className="w-full text-center py-4 text-xs text-black/50 bg-white">
          <div className="mb-1">
            <AboutModalTrigger />
          </div>
          © {new Date().getFullYear()} MagicSats. Todos os direitos reservados.
        </footer>
      </body>
    </html>
  );
}
