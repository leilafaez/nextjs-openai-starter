import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout/AppLayout";
import { useState } from "react";

export default function NewPost() {
  const [postContent,setPostContent]=useState('')
  const handleClick=async()=>{
         const response=await fetch(`/api/generatePost`,{
          method:'POST'
        });
        const json=await response.json()
        console.log('Result:',json.post.postContent)
        setPostContent(json.post.postContent)
  }
    return (
    <div>
      <h1>This is new</h1>
      <button className="btn" onClick={handleClick}>
          Generate
      </button>
      <div className="max-w-screen-sm p-10" dangerouslySetInnerHTML={{__html:postContent}}/>
    
    </div>
  )}
  NewPost.getLayout=function getLayout(page,pageProps){
    return <AppLayout {...pageProps}>{page}</AppLayout>
  }

  export const getServerSideProps =withPageAuthRequired(()=>{
    return{
      props :{ }
    }
  })