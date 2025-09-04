
import { auth } from '@/lib/auth'
import SignInView from '@/modules/auth/views/signin-view'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async() => {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if(!!session){
    redirect('/dashboard')
  }

  return (
    <div>
      <SignInView/>
    </div>
  )
}

export default page
