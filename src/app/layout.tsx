
import type {Metadata} from 'next';
import './globals.css';
import './templates.css';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/context/language-context';
import { CVProvider } from '@/context/cv-context';
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'CV Craft',
  description: 'Build your perfect CV with ease and a touch of AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <body className="font-body antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <CVProvider>
            {children}
            <Toaster />
          </CVProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
