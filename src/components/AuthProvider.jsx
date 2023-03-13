import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import supabaseClient from "@/utilities/supabase/frontend";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Redirect user to appropriate page based on auth status
  const userAuthStatusHandler = useCallback(
    async (isLoggedIn) => {
      if (isLoggedIn) {
        if (router.pathname == "/") await router.replace("/feed");
      } else {
        await router.replace("/");
      }
      setIsLoading(false);
    },
    [router]
  );

  const createUser = async (googleContext) => {
    const res = await fetch(`/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(googleContext),
    });
    const { data, error } = await res.json();
    if (error) console.error(error);
    return data;
  };

  const getUser = async (googleContext) => {
    const res = await fetch(`/api/users/${googleContext.id}`);
    const { data, error } = await res.json();
    if (error) console.error(error);
    return data;
  };

  // Fetch user data if user is logged in
  const throwGoogleContextToBackend = useCallback(async (googleContext) => {
    if (googleContext) {
      const firstTimerUser = new Date() - new Date(googleContext.created_at) <= 3000;
      if (firstTimerUser) {
        setUser(await createUser(googleContext));
      } else {
        setUser(await getUser(googleContext));
      }
    }
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const fetchUser = async () => {
      const res = await supabaseClient.auth.getUser();
      await userAuthStatusHandler(!!res.data.user);
    };
    fetchUser();
  }, []);

  // Set up auth state listener
  useEffect(() => {
    const { data } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          await throwGoogleContextToBackend(session.user);
        }
        await userAuthStatusHandler(!!session?.user);
      }
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }, [userAuthStatusHandler, throwGoogleContextToBackend]);

  const signInWithGoogle = async () => {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
    });

    if (error)
      console.error(
        `Error encountered when attempting to sign in with Google: ${error}`
      );
  };

  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {isLoading ? <div className="font-bold">LOADING...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
