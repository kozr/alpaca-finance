import React from 'react'
import supabaseClient from '@/utilities/supabase/frontend'

const Logout = () => {
  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut()
    if (error) console.log('Error logging out:', error.message)
  }

  return (
    <div>
      <div onClick={signOut}> Log out </div>
    </div>
  )
}

export default Logout