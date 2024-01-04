import { Loader } from "@/components/shared/Loader"
import { PostCard } from "@/components/shared/PostCard"
import { useGetRecentPosts } from "@/lib/react-query/queries"
import { Models } from "appwrite"

export const Home = () => {
    const { data: posts, isPending: isPostLoading, isError: isErrorPost } = useGetRecentPosts()
    return (
        <div className="flex flex-1">
            <div className="home-container">
                <div className="home-posts">
                    <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
                    {isPostLoading && !posts ?
                        (
                            <Loader />
                        ) : (
                            <ul className="flex flex-col flex-1 gap-9 w-full">
                                {posts?.documents.map((post: Models.Document) => (
                                    <PostCard key={post.$id} post={post} />
                                ))}
                            </ul>
                        )}
                </div>
            </div>
        </div>
    )
}