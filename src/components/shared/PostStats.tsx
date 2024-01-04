import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queries"
import { checkIsLiked } from "@/lib/utils"
import { Models } from "appwrite"
import { useEffect, useState } from "react"
import { Loader } from "./Loader"

type PostStatsProps = {
    post: Models.Document,
    userId: string
}

export const PostStats = ({ post, userId }: PostStatsProps) => {

    const likesList = post.likes.map((user: Models.Document) => user.$id)
    const [likes, setLikes] = useState(likesList)
    const [isSaved, setIsSaved] = useState(false)

    const { mutate: likePost } = useLikePost()
    const { mutate: savePost, isPending: isSavingPost } = useSavePost()
    const { mutate: deleteSavePost, isPending: isDeletingSave } = useDeleteSavedPost()

    const { data: currentUser } = useGetCurrentUser()

    const savedPostRecord = currentUser?.save.find(
        (record: Models.Document) => record.post.$id === post.$id
    );

    useEffect(() => {
        setIsSaved(!!savedPostRecord);
    }, [currentUser]);

    const handleLikePost = (
        e: React.MouseEvent<HTMLImageElement, MouseEvent>
    ) => {
        e.stopPropagation();

        let likesArray = [...likes];

        if (likesArray.includes(userId)) {
            likesArray = likesArray.filter((Id) => Id !== userId);
        } else {
            likesArray.push(userId);
        }

        setLikes(likesArray);
        likePost({ postId: post.$id, likesArray });
    };

    const handleSavePost = (
        e: React.MouseEvent<HTMLImageElement, MouseEvent>
    ) => {
        e.stopPropagation();

        if (savedPostRecord) {
            setIsSaved(false);
            return deleteSavePost(savedPostRecord.$id);
        }

        savePost({ userId: userId, postId: post.$id });
        setIsSaved(true);
    };

    return (
        <div className="flex justify-between items-center z-20">
            <div className="flex gap-2 mr-5">
                <img
                    src={`${checkIsLiked(likes, userId) ?
                        "/assets/icons/liked.svg" :
                        "/assets/icons/like.svg"}`}
                    alt="like"
                    width={20}
                    height={20}
                    onClick={handleLikePost}
                    className="cursor-pointer"
                />
                <p className="smal-medium lg:base-medium">{likes.length}</p>
            </div>

            <div className="flex gap-2">
                {isSavingPost || isDeletingSave ? <Loader /> :
                    <img
                        src={`${isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}`}
                        alt="like"
                        width={20}
                        height={20}
                        onClick={handleSavePost}
                        className="cursor-pointer"
                    />
                }
            </div>

        </div>
    )
}