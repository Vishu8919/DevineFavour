// app/layout.js
import '../styles/globals.css'; // Same global CSS you used before

export const metadata = {
  title: 'Divine Favour Boutique',
  description: 'Stylish and Elegant Collection',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
