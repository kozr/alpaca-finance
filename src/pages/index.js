import { useAuth } from "@/components/AuthProvider";
import Wallet from "@/components/Wallet";
import Button from "@/components/Button";

export default function Home() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="flex justify-center items-center min-h-screen">
      <button
        onClick={signInWithGoogle}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      >
        Login
      </button>
    </div>
  );
}
