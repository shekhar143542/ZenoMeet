import { auth } from '@/lib/auth';
import Sidebar from '@/modules/dashboard/components/dashboard-sidebar';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react'


type Props = {
  children: React.ReactNode;
};



const Layout = async({ children }: Props) => {
    const session = await auth.api.getSession({
    headers: await headers()
  })

  if(!session){
    redirect('/sign-in')
  }
  
  return (
    <div className='flex w-full min-h-screen'>

        {/* Sidebar Component*/}
        <Sidebar/>

        <div className='flex flex-col w-full h-screen overflow-auto px-4 scrollbar-hide container mx-auto'>

            {/* Header Component */}

            {children}
        </div>
    </div>
  )
}

export default Layout
