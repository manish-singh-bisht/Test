import React from "react";
import CommentBox from "./CommentBox";
import { useGlobalContext } from "../../CustomHooks/useGlobalContext";
import CommentLikeUnlike from "../../context/Actions/CommentLikeUnlike";
import Post from "../CommonPostComponent/Post";
import LikeUnlike from "../../context/Actions/LikeUnlike";

const CommentCard = ({ comments, postId, parent, fromTweetDetail, fromCommentDetail, isParentPresent, POSTID, mentionHandleCollection, isThread, thread }) => {
    const { ACTIONS, state, dispatchCommentLikeUnlike, dispatch } = useGlobalContext();
    const profile = state.user && state.user.profile && state.user.profile.image.url ? state.user.profile.image.url : null;

    return (
        <>
            {!isParentPresent && <CommentBox profile={profile} postId={postId} parent={parent} mentionHandleCollection={mentionHandleCollection} />}
            {isThread && (
                <>
                    {thread &&
                        thread.length > 0 &&
                        thread.map((item) => {
                            const ownerImage = item.post.owner.profile && item.post.owner.profile.image.url ? item.post.owner.profile.image.url : null;
                            const lastTweetInThread = thread[thread.length - 1];

                            return (
                                <div key={item.post._id} className="relative ">
                                    {thread.length > 1 && lastTweetInThread.post._id !== item.post._id && <div className="absolute left-[2.37rem] top-[4.2rem] h-[calc(100%-3.85rem)]   w-fit border-2"></div>}
                                    <Post
                                        key={item.post._id}
                                        fromTweetDetail={fromTweetDetail}
                                        postId={item.post._id} //this is the comment id
                                        POSTID={fromTweetDetail ? postId : null} //this is the post id
                                        tweet={item.post.tweet}
                                        postImage={item.images ? item.images : null}
                                        likes={item.post.likes}
                                        comments={item.post.comments}
                                        commentsChildren={item.post.comments}
                                        ownerName={item.post.owner.name}
                                        ownerImage={ownerImage}
                                        ownerId={item.post.owner._id}
                                        handle={item.post.owner.handle}
                                        timeCreated={item.post.createdAt}
                                        dispatch={dispatch}
                                        state={state}
                                        ACTIONS={ACTIONS}
                                        handler={LikeUnlike}
                                        mentions={item.post.mentions}
                                    />
                                </div>
                            );
                        })}
                </>
            )}
            {comments &&
                comments.length > 0 &&
                comments.map((comment) => {
                    const ownerImage = comment.owner.profile && comment.owner.profile.image.url ? comment.owner.profile.image.url : null;

                    return (
                        <Post
                            key={comment._id}
                            comment={[comment]} //this is being passed from CommentDetail and is actually child comments of the active comments. its not actually being passed as props, comments is being passed as prop,comment is an instance of comments map.
                            isComment={true}
                            fromTweetDetail={fromTweetDetail}
                            fromCommentDetail={fromCommentDetail}
                            postId={comment._id} //this is the comment id
                            POSTID={fromTweetDetail ? postId : POSTID} //this is the post id
                            tweet={comment.comment}
                            postImage={comment.images}
                            likes={comment.likes}
                            comments={comment.comments}
                            commentsChildren={comment.children}
                            ownerName={comment.owner.name}
                            ownerImage={ownerImage}
                            ownerId={comment.owner._id}
                            handle={comment.owner.handle}
                            timeCreated={comment.createdAt}
                            dispatch={dispatchCommentLikeUnlike}
                            state={state}
                            ACTIONS={ACTIONS}
                            handler={CommentLikeUnlike}
                            mentions={comment.mentions}
                        />
                    );
                })}
        </>
    );
};

export default CommentCard;
