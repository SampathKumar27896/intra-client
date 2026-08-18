import { NavigationMenuDemo } from '../../components/home/bottomNavigation';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
        {children}
        <div className="fixed bottom-4 inset-x-4 z-50">
            <NavigationMenuDemo />
        </div>
    </>
  );
}



