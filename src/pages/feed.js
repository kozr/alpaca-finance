import { useAuth } from "@/components/AuthProvider"

const Feed = () => {
    const { user } = useAuth()
    return (
        <>
            <div className="font-bold text-10xl">
                FEED
            </div>
            <div className="font-bold text-20xl">
                {user.email}
            </div>
        </>
    )
}

export default Feed