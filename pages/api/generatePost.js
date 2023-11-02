import { Configuration,OpenAIApi } from "openai"
export default async function handler(req, res) {
    const config=new Configuration({
        apiKey:process.env.OPENAI_API_KEY
    })
    const openai=new OpenAIApi(config);
    const topic="top 10 tips for dog owners";
    const keywords="first-time dog owners, common gog health issues, best dog breeds"

    const response=await openai.createCompletion(
        {
                model:"text-davinci-003",
                temperature:0,
                max_tokens:3600,
                prompt:`Write a long and detailed SEO-friendly blog post about ${topic},that targets the following comma-seprated keyword:${keywords}.
                content should be formatted in SEO-friendly HTML.
                The respose much include appropriate HTML title and meta description content.
                The return format must be Stringified JSON in the following format: 
                {
                    "PostContent":post content here
                    "title":title goes here
                    "metaDescription": meta description goes here
                } `,
        }
    )
    console.log('response:',response);
    res.status(200).json({ post:JSON.parse( response.data.choices[0]?.text.split("\n").join("")) })
  }