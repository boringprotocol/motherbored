import { IoDownloadOutline } from "react-icons/io5";
import Waiting from "../art/waiting";

const Setup = () => {
  return (
    <>
      <div className="pt-12">
        <div className="container  mx-auto  relative">
          <Waiting />
          <div className="text-sm  absolute top-0">
            <h2 className="text-sm mb-2 text-boring-black dark:text-boring-white">Set-up</h2>
            <p className="text-xs mb-2 text-gray ">Flash image to Pi. Join &quot;boring&quot; WiFi network. Create peer. </p>
            <a
              href="https://s3.us-east-2.amazonaws.com/boringfiles.dank.earth/2022-10-26-boring-lite.zip"
              className="my-6 inline-flex items-center rounded-xs border border-gray dark:border-gray-dark text-xs bg-white dark:bg-black px-3 py-2 text-boring-black dark:text-gray-light hover:bg-boring-white hover:opacity-80 active:opacity-60 shadow-md dark:shadow-sm dark:shadow-black active:shadow-sm"
            ><IoDownloadOutline className="mr-2" />Image</a>
            <div>
              <a className='text-xs text-gray underline hover:opacity-70 active:opacity-50' href="https://www.raspberrypi.com/software/" target="_blank" rel="noreferrer">Raspberry Pi Imager</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Setup
