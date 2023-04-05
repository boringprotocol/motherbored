import Layout from 'components/layout';
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import DripStartDateCountdown from "../../components/DripStartDateCountdown";
import DripCreator from "../../components/DripCreator";
import { IoWaterOutline } from 'react-icons/io5';
import ReactMarkdown from 'react-markdown';


interface Drip {
  approved: any;
  id: string;
  name: string;
  description: string;
  tokenMintAddress: string;
  tokenDecimals: number;
  startDate: string;
  endDate: string;
  userId: string;
}

export default function DripPage() {
  const router = useRouter();
  const { id } = router.query;

  const [drip, setDrip] = useState<Drip>();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (id) {
      axios
        .get(`/api/drip/${id}`)
        .then((response) => {
          setDrip(response.data);
          const startTime = new Date(response.data.startDate).getTime();
          const currentTime = new Date().getTime();
          const timeDiff = startTime - currentTime;

          if (timeDiff > 0) {
            const intervalId = setInterval(() => {
              const newTimeDiff = startTime - new Date().getTime();
              if (newTimeDiff > 0) {
                const days = Math.floor(newTimeDiff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((newTimeDiff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((newTimeDiff / (1000 * 60)) % 60);
                const seconds = Math.floor((newTimeDiff / 1000) % 60);
                setTimeLeft({ days, hours, minutes, seconds });
              } else {
                clearInterval(intervalId);
              }
            }, 1000);
            return () => clearInterval(intervalId);
          }
        })
        .catch((error) => console.log(error));
    }
  }, [id]);

  if (!drip) {
    return <div>Loading...</div>;
  }

  // Format the start and end dates using Date.toLocaleString()
  const startDate = new Date(drip.startDate).toLocaleString();
  const endDate = new Date(drip.endDate).toLocaleString();

  return (
    <Layout>
      <div className="p-8 prose">

        {drip.approved ? (
          <div className="">
            <div className="px-4 sm:px-0">

              <h1 className="pt-8 mb-0 text-2xl flex items-center">
                <span className="mr-1">
                  <IoWaterOutline />
                </span>
                aird.rip
              </h1>

              <h2 className="text-xs ml-6 mt-0">from Boring Protocol</h2>

            </div>

            <h1 className="text-6xl">{drip.name}</h1>

            <p>Scheduled</p>
            <DripStartDateCountdown startDate={drip.startDate} />
          </div>
        ) : (
          <div className="alert shadow-lg mb-12">This drip has not been approved yet.</div>
        )}

        {/* <p className='my-4'>{drip.description}</p> */}
        <ReactMarkdown children={drip.description} />

        {/* <ReactMarkdown children={drip.description} renderers={{
          paragraph: (props) => <p className="my-4">{props.children}</p>,
          link: (props) => <a href={props.href} className="text-blue-500">{props.children}</a>,
        }} /> */}


        <p>Token mint address:<a href={`https://solscan.io/token/${drip.tokenMintAddress}`}>{drip.tokenMintAddress}</a></p>
        {/* <p>Token decimals: {drip.tokenDecimals}</p> */}
        <p>Start date: {startDate}</p>
        <p>End date: {endDate}</p>

        <div className=''>

          <span className="font-bold">{drip.name}</span> is brought to you by:
          <DripCreator userId={drip.userId} />
          <p>User ID: (Creator Profile) <a className="btn btn-outline" href={`/a/${drip.userId}`}>{drip.userId}</a></p>

        </div>
      </div>
    </Layout>
  );
}
