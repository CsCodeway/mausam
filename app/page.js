import WeatherCard from "@/components/WeatherCard";
import Head from "next/head";

const App = () => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=1, maximum-scale=1"
        />
      </Head>
      <WeatherCard />
    </>
  );
};
export default App;
