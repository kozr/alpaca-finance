import { useAuth } from "@/components/AuthProvider"

export default function Home() {
  const { signInWithGoogle } = useAuth()

  return (
    <>
      <button onClick={() => signInWithGoogle()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        Login
      </button>
    </>
  )
}
