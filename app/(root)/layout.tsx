import { isAuthenticated } from '@/lib/actions/auth.action';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react'

const RootLayout = async ({ children }: { children: ReactNode}) => {

  const isUserAuthenticated = await isAuthenticated();

  if(!isUserAuthenticated) redirect('/sign-in');

  
  return (
    <div className="root-layout">
      <nav>
        <Link href="/" className="flex items-center gap-1">
          <Image src="/newlogo.png"
          alt="Logo"
          width={100}
          height={100}
          className="object-contain"/>

          <h2 className="text-primary-200 text-5xl font-bold leading-none">
          PrepView
          </h2>
      </Link>
      </nav>
      
      {children}
    </div>
  )
}

export default RootLayout;