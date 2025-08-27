
import type {Metadata} from 'next';
import './globals.css';
import './templates.css';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/context/language-context';
import { CVProvider } from '@/context/cv-context';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

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
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground transition-colors duration-300" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <CVProvider>
              {children}
              <Toaster />
            </CVProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
