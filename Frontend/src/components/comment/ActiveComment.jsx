import React, { Suspense, forwardRef, useCallback, useEffect, useState } from "react";
import useAnimation from "../../CustomHooks/useAnimation";
import { usePostTimeInTweetDetail } from "../../CustomHooks/usePostTime";
import { Bookmark, Comments, HeartLike, HeartUnlike, Retweets, ThreeDots } from "../SVGs/SVGs";
import { Link } from "react-router-dom";
import Avatar from "../Avatar/Avatar";
import PhotoGallery from "../CommonPostComponent/PhotoGallery";
import CommentBox from "./CommentBox";
import ModalForLikesBookmarksRetweets from "../Modal/ModalForLikesBookmarksRetweets";
import Loader from "../Loader/Loader";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import axios from "axios";

const MoreOptionMenuModal = React.lazy(() => import("../Modal/MoreOptionMenuModal"));

const ActiveComment = forwardRef(({ commentId, postId, parent }, ref) => {
    const { state } = useGlobalContext();

    //Modal for more option
    const [visibility, setVisibility] = useState(false);
    const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 }); //for getting the position of the button that triggers the modal to open
    const [infoToMoreOptionModal, setInfoToMoreOptionModal] = useState({ ownerID: "", commentID: "", postID: "" });

    const handleOutsideClickMoreOption = (event) => {
        if (event.target === event.currentTarget) {
            setVisibility(false);
            document.body.style.overflow = "unset";
        }
    };
    const onCloseMoreOptionModal = () => {
        setVisibility(false);
        document.body.style.overflow = "unset";
    };

    //Modal for like,retweet,Bookmark
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [type, setType] = useState("");
    const [list, setList] = useState(null);

    const hideModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = "unset";
    };

    //For like and unlike of comment
    const [isLiked, setIsLiked] = useState(false);
    const [liked, setLiked] = useState(null);
    const [likedBy, setIsLikedBy] = useState([]);

    const [comment, setComment] = useState();
    const [commentt, setCommentt] = useState();
    const [mentionHandleCollection, setMentionHandleCollection] = useState([]);
    const [photos, setPhotos] = useState();

    const fetchData = useCallback(async () => {
        const { data } = await axios.get(`http://localhost:4000/api/v1/comment/${commentId}`, { withCredentials: true });
        setMentionHandleCollection(data.mentionsHandleCollection);
        let like = [];
        like = data.comment.likes;
        setIsLikedBy(like);
        setLiked(like.length);

        setPhotos(data.comment.images);
        //For keeping the heart red or unred even after refreshing the page
        like.forEach((item) => {
            if (item._id === state.user._id) {
                setIsLiked(true);
            }
        });

        like.length === 0 && setIsLiked(false);
        setComment(data.comment);

        // Regex pattern to find mentions and make them blue,in the display after it is posted
        const mentionRegex = /(@)(\w+)/g;
        const parts = data.comment.comment.split(mentionRegex);
        const renderedComment = [];
        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (part.startsWith("@")) {
                // Merge the delimiter with the next word
                const nextPart = parts[i + 1];
                const mergedPart = nextPart ? part + nextPart : part;
                // Skip the next part;
                i++;

                if (data.comment.mentions.includes(nextPart.toString())) {
                    renderedComment.push(
                        <span key={i} className="text-blue-500">
                            {mergedPart}
                        </span>
                    );
                } else {
                    renderedComment.push(mergedPart);
                }
            } else {
                renderedComment.push(part);
            }
        }
        setCommentt(renderedComment);
    }, [commentId, isLiked]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    //ANIMATION FOR THE NUMBER NEXT TO LIKE/UNLIKE USING CUSTOM HOOK
    const [animationLikes, likedValue, handleLikesAnimation] = useAnimation(isLiked, setIsLiked, liked, setLiked);

    const likeHandler = async () => {
        handleLikesAnimation();
        await axios.get(`http://localhost:4000/api/v1/post/comment/${commentId}`, { withCredentials: true });
    };

    //Grid layout for different numbers of image,used below
    let gridClass = "";
    switch (photos?.length) {
        case 0:
            gridClass = "";
            break;
        case 1:
            gridClass = "w-full h-full";
            break;
        case 2:
            gridClass = "grid-cols-2 grid-rows-1";
            break;
        case 3:
            gridClass = "grid-cols-2 grid-rows-2";
            break;
        case 4:
            gridClass = "grid-cols-2 grid-rows-2";
            break;
        default:
            break;
    }

    const tv = 0;
    const formattedTime = usePostTimeInTweetDetail(Date.parse(comment?.createdAt));
    return (
        comment !== undefined && (
            <main className="grid   grid-cols-[44vw_auto] ">
                <div className="flex h-[100%]   flex-col">
                    <div className=" m-2">
                        <div className="flex gap-2">
                            <div>
                                <Avatar profile={comment.owner.profile && comment.owner.profile.image.url ? comment.owner.profile.image.url : null} />
                            </div>

                            <div className=" flex h-fit w-full flex-col gap-2  ">
                                <div className="flex">
                                    <Link to={`/user/${comment.owner._id}`} className="flex w-fit flex-col  text-[1.1rem] font-bold ">
                                        <span className="hover:underline">{comment.owner.name}</span>
                                        <span className="mt-[-0.3rem] text-[0.9rem] font-normal text-gray-700">{`@${comment.owner.handle}`}</span>
                                    </Link>
                                    <div
                                        className="ml-auto h-min cursor-pointer  rounded-full hover:bg-blue-100  hover:text-blue-500 "
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setVisibility(true);
                                            const buttonRect = e.target.getBoundingClientRect();
                                            const top = buttonRect.top + buttonRect.height;
                                            const left = buttonRect.left;
                                            setButtonPosition({ top, left });
                                            setInfoToMoreOptionModal({ ownerID: comment.owner._id, commentID: comment._id, postID: comment.post._id });
                                            document.body.style.overflow = "hidden";
                                        }}>
                                        <ThreeDots />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="m-2">
                            <pre className={` mb-3 max-w-[98%] whitespace-pre-wrap break-words text-2xl`}>{commentt}</pre>
                            <div className={`m-[-0.25rem] grid max-w-[98%]  ${gridClass}  ${photos?.length > 1 ? `max-h-[18rem]` : "max-h-[30rem]  "}  gap-[0.05rem] rounded-xl  ${photos?.length > 0 ? `border-[0.05rem]` : ``}`}>
                                {photos?.length > 0 && photos?.map((photo, index) => <PhotoGallery key={index} photos={photos} photo={photo.url} index={index} />)}
                            </div>
                        </div>
                    </div>
                    <div className="mx-4  "> {formattedTime}</div>
                    <div className="m-4  border-t-[0.01rem] opacity-80"></div>
                    {likedValue > 0 || tv > 0 ? (
                        <>
                            <div className="mx-4 flex gap-8  font-bold">
                                {tv > 0 && (
                                    <div className="cursor-pointer">
                                        <span className={`${animationLikes}`}>1</span> <span className={` text-[0.9rem] font-normal hover:underline`}>Retweets</span>
                                    </div>
                                )}
                                <div className="cursor-pointer">
                                    <span className={`${animationLikes}`}>1</span> <span className={`text-[0.9rem] font-normal hover:underline`}>Quotes</span>
                                </div>
                                {likedValue > 0 ? (
                                    <div
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setIsModalOpen(true);
                                            document.body.style.overflow = "hidden";
                                            setType("Liked");
                                            setList(likedBy);
                                        }}>
                                        {likedValue > 0 ? <span className={`${animationLikes} mr-1`}>{likedValue}</span> : null}
                                        <span className={`text-[0.9rem] font-normal hover:underline`}>Likes</span>
                                    </div>
                                ) : null}
                                <div className="cursor-pointer">
                                    <span className={`${animationLikes}`}>1</span> <span className={` text-[0.9rem] font-normal hover:underline`}>Bookmarks</span>
                                </div>
                            </div>
                            <div className="m-4  border-t-[0.01rem] opacity-80"></div>
                        </>
                    ) : null}
                    <div className="  mx-2 -mt-2 flex scroll-mt-32   gap-20 pl-10" ref={ref}>
                        <div className="group flex items-center justify-center gap-2 ">
                            <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                                <Comments bigIcon={true} />
                            </button>
                        </div>

                        <div className="group flex items-center justify-center gap-2 ">
                            <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-green-100 group-hover:text-green-500">
                                <Retweets bigIcon={true} />
                            </button>
                        </div>
                        <div className=" group flex items-center justify-center gap-2  ">
                            <button className=" flex h-8 w-8 items-center justify-center rounded-full  group-hover:bg-red-100 group-hover:text-red-500" onClick={likeHandler}>
                                {isLiked ? <HeartLike bigIcon={true} /> : <HeartUnlike bigIcon={true} />}
                            </button>
                        </div>
                        <div className="group flex items-center justify-center gap-2 ">
                            <button className=" flex h-8 w-8 items-center justify-center rounded-full group-hover:bg-blue-100 group-hover:text-blue-500">
                                <Bookmark bigIcon={true} />
                            </button>
                        </div>
                    </div>
                    <div className="mx-4 mt-4  border-t-[0.01rem] opacity-80"></div>
                    <CommentBox profile={comment.owner.profile && comment.owner.profile.image.url ? comment.owner.profile.image.url : null} postId={postId} parent={parent} mentionHandleCollection={mentionHandleCollection} />
                </div>
                <Suspense fallback={<Loader />}>
                    <ModalForLikesBookmarksRetweets visibility={isModalOpen} onClose={hideModal} type={type} list={list} />
                    <MoreOptionMenuModal
                        visibility={visibility}
                        handleOutsideClick={handleOutsideClickMoreOption}
                        buttonPosition={buttonPosition}
                        infoToMoreOptionModal={infoToMoreOptionModal}
                        onCloseMoreOptionModal={onCloseMoreOptionModal}
                        fromActiveComment={true}
                        detailsOfActiveComment={comment}
                    />
                </Suspense>
            </main>
        )
    );
});

export default ActiveComment;
