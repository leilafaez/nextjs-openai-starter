import React, { useCallback, useReducer, useState } from "react";

const PostsContext=React.createContext({})

export default PostsContext;

function postReducer(state,action) {
  switch(action.type){
    case "addPosts" :{
      const newPosts = [...state];
      action.posts.forEach((post) => {
        const exist = newPosts.find((p) => p._id === post._id);
        if (!exist) {
          newPosts.push(post);
        }
      });
      return newPosts;
    }
    case "deletePosts" :{
      return state.filter((post) => post._id !== action.postId);
    }
    default :
    return state;
  }
}

export const PostsProvider=({children})=>{
    const[posts,dispatch]=useReducer(postReducer,[]);
    const[noMorePosts,setNoMorePosts]=useState(false);

    
    const deletePost = useCallback((postId) => {
      dispatch({
        type: "deletePosts",
        postId,
      });
     
    }, []);

    const setPostsFromSSR=useCallback((postsFromSSR=[])=>{
        console.log('Posts From SSR: ',postsFromSSR);
          dispatch({
            type: "addPosts",
            posts : postsFromSSR
          });
       
    },[]);

    const getPosts=useCallback(async ({lastPostDate,getNewerPosts=false})=>{
        const result=await fetch(`/api/getPosts`,{
            method:"POST",
            headers:{
                'content-type':"application/json"
            },
            body:JSON.stringify({lastPostDate,getNewerPosts})
        });
        const json=await result.json()
        const postsResult=json.posts || [];
        console.log('POSTS RESULT: ',postsResult);
        if(postsResult.length<5){
            setNoMorePosts(true);
        }
        dispatch({
          type: "addPosts",
          posts: postsResult,
        });
        
    },[])
    return(
    <PostsContext.Provider value={{posts,setPostsFromSSR,getPosts,noMorePosts,deletePost }}>{children}</PostsContext.Provider>
    );
}