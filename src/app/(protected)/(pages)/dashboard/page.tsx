import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async() => {

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if(!session){
    redirect('/sign-in')
  }

  return (
    <div>
      dashboard page
    </div>
  )
}

export default page
