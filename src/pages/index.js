import { useAuth } from "@/components/AuthProvider";
import Wallet from "@/components/Wallet";

export default function Home() {
  const { signInWithGoogle } = useAuth();

  const testEmail = async () => {
    const response = await fetch("/api/emailCancelRequest", { method: "POST" });
    const data = await response.json();
    alert(JSON.stringify(data));
  };

  const listEmailJobs = async () => {
    const response = await fetch("/api/listQueueJobs", {
      method: "POST",
      body: JSON.stringify({ queueName: "emailQueue" }),
      contentType: "application/json",
    });
    const data = await response.json();
    alert(JSON.stringify(data));
  };

  return (
    <div className="px-10">
      <button
        onClick={() => signInWithGoogle()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
      >
        Login
      </button>
      <button onClick={testEmail}>Send Email</button>
      <button onClick={listEmailJobs}>List Email Jobs</button>
      <Wallet balance={1000.1} />
    </div>
  );
}
