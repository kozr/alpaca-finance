import supabase from '@/utilities/supabase'
import Wallet from '@/components/Wallet'

const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
}

export default function Home() {
  return (
    <div className='px-10'>
      <button onClick={() => signInWithGoogle()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        Login
      </button>
      <Wallet balance={1000.10} />
    </div>
  )
}
