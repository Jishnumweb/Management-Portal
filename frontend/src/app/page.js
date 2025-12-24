"use client"

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

function Frontpage() {
  useEffect(()=>{
    redirect("/admin/leads")

  },[])
  return (
    <div>
      
    </div>
  )
}

export default Frontpage
