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
  const [googleContext, setGoogleContext] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Redirect user to appropriate page based on auth status
  const userAuthStatusHandler = useCallback(
    async (context) => {
      if (context !== null) {
        setGoogleContext(context);
        if (router.pathname == "/") await router.replace("/feed");
      } else {
        await router.replace("/");
      }
      setIsLoading(false);
    },
    [router]
  );

  // Check if user is already logged in
  useEffect(() => {
    const fetchUser = async () => {
      const res = await supabaseClient.auth.getUser();
      await userAuthStatusHandler(res.data.user);
    };
    fetchUser();
  }, [userAuthStatusHandler]);

  // Set up auth state listener
  useEffect(() => {
    const { data } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        await userAuthStatusHandler(session.user);
      }
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }, [userAuthStatusHandler]);

  // Fetch user data if user is logged in
  useEffect(() => {
    if (googleContext) {
      const getOrCreateUser = async (googleContext) => {
        const createdWithinLastSecond =
          new Date() - new Date(googleContext.created_at) <= 1000;
        if (createdWithinLastSecond) {
          // first time user
          const { data, error } = await fetch(`/api/users`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(googleContext),
          });
          if (error) console.error(error);
          setUser(data);
        } else {
          const { data, error } = await fetch(`/api/users/${googleContext.id}`);
          if (error) console.error(error);
          setUser(data);
        }
      };
      getOrCreateUser(googleContext);
    }
  }, [googleContext]);

  const signInWithGoogle = async () => {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
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