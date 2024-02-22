import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { Logo } from "../Logo";
import PostsContext from "../../context/postsContext";
import { useEffect, useContext } from "react";

export const AppLayout = ({
  children,
  availableTokens,
  posts: postsFromSSR,
  postId,
  postCreated,
}) => {
  const { user } = useUser();
  const { setPostsFromSSR, posts, getPosts, noMorePosts } =
    useContext(PostsContext);

  useEffect(() => {
    setPostsFromSSR(postsFromSSR);
    if (postId) {
      const exist = postsFromSSR.find((post) => post._id === postId);
      if (!exist) {
        getPosts({ getNewerPosts: true, lastPostDate: postCreated });
      }
    }
  }, [postsFromSSR, setPostsFromSSR, postId, postCreated, getPosts]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[300px,1fr] h-screen max-h-screen">
      <div className="md:flex md:flex-col text-white overflow-hidden">
        <div className="bg-slate-800 px-2">
          <Logo />
          <Link href="/post/new" className="btn">
            New Post
          </Link>
          <Link href="/token-topup" className="block mt-2 text-center">
            <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
            <span className="pl-1">{availableTokens} tokens available</span>
          </Link>
        </div>
        <div className="md:flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/post/${post._id}`}
              className={`py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${
                postId === post._id ? "bg-white/20 border-white" : ""
              }`}
            >
              {post.topic}
            </Link>
          ))}
          {!noMorePosts && (
            <div
              onClick={() => {
                if (posts.length > 0) {
                  getPosts({ lastPostDate: posts[posts.length - 1].created });
                }
              }}
              className={`hover:underline text-sm text-slate-500 text-center cursor-pointer mt-4 ${
                posts.length === 0 ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              Load more posts
            </div>
          )}{" "}
        </div>
        <div className="bg-cyan-800 flex flex-col justify-between md:h-20">
          {!!user ? (
            <div className="flex items-center flex-col md:flex-row justify-center md:justify-start md:mt-2">
              <div className="w-12 h-12 overflow-hidden rounded-full">
                <Image
                  src={user.picture}
                  alt={user.name}
                  height={50}
                  width={50}
                  className="rounded-full"
                />
              </div>
              <div className="md:ml-2 mt-2 md:mt-0">
                <div className="font-bold text-center md:text-left">
                  {user.email}
                </div>
                <Link className="text-sm" href="/api/auth/logout">
                  logout
                </Link>
              </div>
            </div>
          ) : (
            <Link href="/api/auth/login">login</Link>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};
