
import { auth } from '@/lib/auth'
import SignUpView from '@/modules/auth/views/signup-view'
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
      <SignUpView/>
    </div>
  )
}

export default page
