import React from "react";
import { Cross } from "../SVGs/SVGs";
import { Link } from "react-router-dom";

const ModalForLikesBookmarksRetweets = ({ visibility, onClose, type, list, handleOutsideClick }) => {
    if (!visibility) return;

    return (
        <>
            <div className="fixed inset-0 z-30 flex  h-[100vh] w-[100vw] items-center justify-center">
                <div className="fixed  h-[100vh] w-[100vw]  bg-black opacity-40" onClick={handleOutsideClick}></div>
                <div className="relative  flex h-auto max-h-[40rem]  min-h-[83vh] w-[41vw] flex-col  overflow-y-auto  rounded-xl bg-white ">
                    <div className=" sticky inset-0 mb-3 flex h-fit w-full items-center gap-4 bg-white/60  backdrop-blur-md  ">
                        <div className="  m-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full  p-2 hover:bg-gray-200" onClick={onClose}>
                            <Cross className="  " />
                        </div>
                        <div className="text-xl font-bold">{type} by</div>
                    </div>

                    {list.length > 0 &&
                        list.map((item) => {
                            return (
                                <Link to="/test" key={item._id} className=" hover:bg-gray-100">
                                    <div className="mx-4 mt-2 flex flex-col gap-1 ">
                                        <div className="flex gap-3 ">
                                            {item.profile && item.profile.image.url ? (
                                                <div className=" h-[3.2rem] max-w-[3.2rem] items-center justify-center rounded-full   bg-gray-400">
                                                    <img src={item.profile.image.url} alt="profile image" className="h-full w-full rounded-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="relative  flex h-[3.2rem] min-w-[3.2rem] items-center justify-center  rounded-full bg-gray-200">
                                                    <svg className="  h-9 w-9 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="flex w-full items-start justify-between ">
                                                <div className=" flex flex-col align-top">
                                                    <div className="  text-[1.1rem] font-bold hover:underline">{item.name}</div>
                                                    <div className="">{`@${item.handle}`}</div>
                                                </div>
                                                <button className="h-[2.1rem] w-[4.5rem] rounded-[5rem] bg-black  text-white">Follow</button>
                                            </div>
                                        </div>
                                        <div className="ml-[4rem]   pb-5">Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae mollitia eveniet quos consequatur laudantium repellat voluptatibus velit vel quis expedita.</div>
                                    </div>
                                </Link>
                            );
                        })}
                </div>
            </div>
        </>
    );
};

export default ModalForLikesBookmarksRetweets;
