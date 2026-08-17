import type { Metadata } from "next";
import { NavigationMenuDemo } from '../../components/home/bottomNavigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        {children}
    </>
  );
}
