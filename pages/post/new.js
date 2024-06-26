import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout/AppLayout";
import { useState } from "react";
import { useRouter } from "next/router";
import { getAppProps } from "../../utils/getAppProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBrain } from "@fortawesome/free-solid-svg-icons";

export default function NewPost() {
  const router = useRouter();
  const[topic ,setTopic]=useState('')
  const[keywords ,setKeywords]=useState('')
  const[generating,setGenerating]=useState(false)

 const handleSubmit = async (e) => {
   e.preventDefault();
   setGenerating(true);
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
     setGenerating(false);
   }
 };
    return (
      <div className="h-full overflow-hidden">
        {!!generating && (
          <div className="text-green-500 flex h-full animate-pulse w-full flex-col justify-center items-center">
            <FontAwesomeIcon icon={faBrain} className="text-8xl" />
            <h6>Generating...</h6>
          </div>
        )}
        {!generating && (
          <div className="w-full h-full flex flex-col overflow-auto">
            <form
              onSubmit={handleSubmit}
              className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200"
            >
              <div>
                <label>
                  <strong>Generate a blog post on topic of:</strong>
                </label>
                <textarea
                  className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  maxLength={80}
                />
              </div>
              <label>
                <strong>Targeting the following keyword:</strong>
              </label>
              <textarea
                className="resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                maxLength={80}
              />
              <small className="block mb-2">
                Separate keywords with a comma
              </small>
              <div></div>
              <button
                type="submit"
                className="btn"
                disabled={!topic.trim() || !keywords.trim()}
              >
                Generate
              </button>
            </form>
          </div>
        )}
      </div>
    );}
  NewPost.getLayout=function getLayout(page,pageProps){
    return <AppLayout {...pageProps}>{page}</AppLayout>
  }

  export const getServerSideProps = withPageAuthRequired({
    async getServerSideProps(ctx) {
      const props = await getAppProps(ctx);
       if (!props.availableTokens) {
         return {
           redirect: {
             destination: "/token-topup",
             permanent: false,
           },
         };
       }

      return {
        props,
      };
    },
  });