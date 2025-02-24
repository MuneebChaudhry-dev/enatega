import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { PrimeReactProvider } from 'primereact/api';
import { ReduxProvider } from '@/providers/redux-provider';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export const metadata: Metadata = {
  title: 'Enatega-Food Delivery',
  description: 'A multi vendor food delivery app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${poppins.className}  antialiased`}>
        {' '}
        <ReduxProvider>
          <PrimeReactProvider value={{ unstyled: true, pt: {} }}>
            {children}
          </PrimeReactProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
