'use client'
import './globals.css';
import { AnimatePresence, motion } from 'framer-motion';
import Header from './components/Header/Header';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">
        <Header />

        <AnimatePresence mode="wait">
          <motion.div
            key={pathname} // clave única por página
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </body>
    </html>
  );
}
