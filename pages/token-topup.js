
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../components/AppLayout/AppLayout";
import { getAppProps } from "../utils/getAppProps";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons"; // Assuming this is the icon you want to use

export default function TokenTopUp() {
  const handleClick = async () => {
    const result= await fetch(`/api/addTokens`,{
      method: "POST",
    })
    const json=await result.json()
    console.log('Result:',json);
    window.location.href=json.session.url;  };
  return (
    <div className="w-full h-full flex flex-col overflow-auto">
      <div className="m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200">
        <h1 className="text-3xl mb-4">
          <FontAwesomeIcon icon={faCoins} className="mr-2" />
          Token
        </h1>
        <button className="btn" onClick={handleClick}>
          Add tokens
        </button>
      </div>
    </div>
  );
}

TokenTopUp.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    return {
      props,
    };
  },
});
