import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout/AppLayout";
import { useState } from "react";

export default function NewPost() {
  const [postContent,setPostContent]=useState('')
  const[topic ,setTopic]=useState('')
  const[keywords ,setKeywords]=useState('')

 const handleSubmit = async (e) => {
   e.preventDefault();
   try {
     const response = await fetch(`/api/generatePost`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ topic, keywords }),
     });

     if (!response.ok) {
       const errorResponse = await response.json();
       console.error("Error response:", errorResponse);
      
       return;
     }

     const json = await response.json();
     if (json.post && json.post.postContent) {
       setPostContent(json.post.postContent);
     } else {
       // Handle the case where post or post.postContent is undefined
       console.error("Error: Post content is undefined.");
     }
   } catch (error) {
     console.error("ERROR:", error);
   }
 };
    return (
    <div>
       <form onSubmit={handleSubmit}>
        <div>
            <label>
              <strong>
                Generate a blog post on topic of:
              </strong>
            </label>
            <textarea className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm" value={topic} onChange={e=>setTopic(e.target.value)}/>
        </div>
        <label>
              <strong>
                Targeting the following keyword:
              </strong>
            </label>
            <textarea 
            className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm" value={keywords} onChange={e=>setKeywords(e.target.value)}/>
        <div>
          
        </div>
            <button type="submit" className="btn" >
          Generate
            </button>
       </form>
      
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