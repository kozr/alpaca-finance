import supabase from '@/utilities/supabase'

const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
}

export default function Home() {
  return (
    <>
      <button onClick={() => signInWithGoogle()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        Login
      </button>
    </>
  )
}
