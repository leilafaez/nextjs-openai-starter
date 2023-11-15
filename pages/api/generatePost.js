import { Configuration, OpenAIApi } from "openai";
export default async function handler(req, res) {
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(config);
  const { topic, keywords } = req.body;
  const postContentResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: "you are ablog post generator",
      },
      {
        role: "user",
        content: `Write a long and detailed SEO-friendly blog post about ${topic},that targets the following comma-seprated keyword:${keywords},
                         content should be formatted in SEO-friendly HTML,
                         limited to the followinh HTML tags:p, h1, h2, h3, h4, h5, h6, strong, li, ul, ol, i`,
      },
    ],
  });
  const postContent =
    postContentResponse.data.choices[0]?.message?.content || "";
  const titleResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: "you are ablog post generator",
      },
      {
        role: "user",
        content: `Write a long and detailed SEO-friendly blog post about ${topic},that targets the following comma-seprated keyword:${keywords},
                         content should be formatted in SEO-friendly HTML,
                         limited to the followinh HTML tags:p, h1, h2, h3, h4, h5, h6, strong, li, ul, ol, i`,
      },
      {
        role: "assistant",
        content: postContent,
      },
      {
        role: "user",
        content: "Generate appropriate title tag text for the above blog post",
      },
    ],
  });
  const metaDescriptionResponse = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    temperature: 0,
    messages: [
      {
        role: "system",
        content: "you are ablog post generator",
      },
      {
        role: "user",
        content: `Write a long and detailed SEO-friendly blog post about ${topic},that targets the following comma-seprated keyword:${keywords},
                         content should be formatted in SEO-friendly HTML,
                         limited to the followinh HTML tags:p, h1, h2, h3, h4, h5, h6, strong, li, ul, ol, i`,
      },
      {
        role: "assistant",
        content: postContent,
      },
      {
        role: "user",
        content:
          "Generate SEO-friendly meta description content for the above blog post",
      },
    ],
  });
  const title = titleResponse.data.choices[0]?.message?.content || "";
  const metaDescription =
    metaDescriptionResponse.data.choices[0]?.message?.content || "";
  console.log("POST CONTENT:", postContent);
  console.log("TITLE:", title);
  console.log("META DESCRIPTION:", metaDescription);

  res.status(200).json({
    post: {
      postContent,
      title,
      metaDescription,
    },
  });
  // res.status(200).json({
  //      post:JSON.parse( response.data.choices[0]?.text.split("\n").join("")) })
}