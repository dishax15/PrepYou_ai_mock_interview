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
        <Link href="/" className="flex items-center">
          <Image src="/Icon_Prepview.png"
          alt="Logo"
          width={110}
          height={110}
          className="object-contain"/>

          <h2 className="text-primary-200 text-5xl font-bold">
          PrepView
          </h2>
      </Link>
      </nav>
      
      {children}
    </div>
  )
}

export default RootLayout;