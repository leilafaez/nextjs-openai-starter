import {getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb/lib";




export default withApiAuthRequired(async function handler(req,res){
    try{
        const{user:{sub}}=await getSession(req,res);
        const client = await clientPromise;
        const db = client.db("BlogStandard");
        const userProfile= await db.collection("users").findOne({
            auth0Id:sub
        });

        const {postId} = req.body;

        await db.collection("posts").deleteOne({
            userId : userProfile._id,
            _id: new ObjectId(postId)
        });
        res.status(200).json({sucess : true});

    }catch(e){
        console.log("ERROR TYRING TO DELETE A POST :" , e);
    }
    return;
});