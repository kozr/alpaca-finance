import { createContext, useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import supabaseClient from '@/utilities/supabase'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter()

    // Check if user is already logged in
    useEffect(() => {
        const fetchUser = async () => {
            const res = await supabaseClient.auth.getUser()
            await userAuthStatusHandler(res.data.user)
        }
        fetchUser()
    }, [])

    // Set up auth state listener
    useEffect(() => {
        const { data } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
            await userAuthStatusHandler(session)
        })

        return () => {
            data.subscription.unsubscribe()
        }
    }, [])

    const userAuthStatusHandler = async (user) => {
        if (user !== null) {
            setUser(user)
            if (router.pathname == '/') await router.replace('/feed')
        } else {
            await router.replace('/')
        }
        setIsLoading(false)
    }

    const signInWithGoogle = async () => {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google'
        })

        if (error) console.error(`Error encountered when attempting to sign in with Google: ${error}`)
    }

    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            { isLoading ? <div className="font-bold">LOADING...</div> : children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)