import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout/AppLayout";
import { useState } from "react";
import { useRouter } from "next/router";

export default function NewPost() {
  const router = useRouter();
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
     console.log("RESULT :" ,json);
     if(json?.postid){
      router.push(`/post/${json.postid}`)

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