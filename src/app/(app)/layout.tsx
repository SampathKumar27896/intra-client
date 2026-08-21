
import { NavigationMenuDemo } from '../../components/home/bottomNavigation';
import { FloatingPlayer } from '../../components/home/floatingPlayer';
import AudioElement from '../../components/audioPlayer/audioElement';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 
  return (
    <>
        {children}
         <AudioElement />
        
        <div className="fixed bottom-16 inset-x-0 z-51">
            <FloatingPlayer />
        </div>
        <div className="fixed bottom-0 inset-x-0 z-50">
            <NavigationMenuDemo />
        </div>
    </>
  );
}



