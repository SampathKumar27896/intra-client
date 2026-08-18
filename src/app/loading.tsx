import { LoaderCircle } from 'lucide-react'
export default function Loading() {
  // Or a custom loading skeleton component
  return <div className="h-full w-full absolute inset-x-[45dvw] inset-y-[45dvh] ">
          <LoaderCircle className="animate-spin" size={48}/>
          <p>Loading...</p>
    </div>
}