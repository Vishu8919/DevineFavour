import '../styles/globals.css';
import Providers from '../lib/Providers'; // correct path

export const metadata = {
  title: 'Divine Favour Boutique',
  description: 'Stylish and Elegant Collection',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
