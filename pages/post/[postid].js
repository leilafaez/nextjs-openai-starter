import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout/AppLayout";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb/lib";

export default function Post(props) {

  console.log("PROPS:" , props);

  return (
    <div>
      <h1>visit id</h1>
    </div>
  );
}

 Post.getLayout = function getLayout(page, pageProps) {
   return <AppLayout {...pageProps}>{page}</AppLayout>;
 };

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx){
    const userSession = await getSession(ctx.req,ctx.res);
    console.log("User session:", userSession.user.sub);

    const client= await clientPromise;
    const db = client.db("BlogStandard");

    const user = await db.collection("users").findOne({
      auth0Id : userSession.user.sub,
    });
    console.log("User document from DB:", user);
    if(!user){
      console.log("No user found with the given auth0ID");
    }

    console.log("Looking for post with ID:", ctx.params.postid);
    const post = await db.collection("posts").findOne({
      _id: new ObjectId(ctx.params.postid),
      userId: user._id,

    })
    console.log("Post document from DB:", post);

    if(!post){
      console.log("No post found, redirecting to /post/new");
      return{
        redirect:{
          destination:"/post/new",
          permanent:false
        }
      }
    }

    return{
      props:{
        postContent: post.postContent,   
        title : post.title,
        metaDescription : post.metaDescription,
        keywords : post.keywords,
      
        
      },
    };
  },
});
