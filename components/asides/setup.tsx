import { IoDownloadOutline } from "react-icons/io5"
import Waiting from "../art/waiting"

const Setup = () => {
  return (
    <>

      <div className="card border-t border-base-200 pt-12">
        <div className="card-body relative p-8">
          <Waiting />
          <div className="text-xs absolute top-0">
            <h1 className="text-2xl">Build a Node</h1>
            <p className="text-xs">Download image and flash to your Raspberry Pi SD card. Join &quot;boring&quot; WiFi network. Create peer. </p>
            <a
              href="https://s3.us-east-2.amazonaws.com/boringfiles.dank.earth/2023-03-24-boring-lite.zip"
              className="btn btn-outline btn-outline-bla"
            ><IoDownloadOutline className="mr-2" />Image</a>
            <div>

            </div>
            <p className='mt-4'>
              <a href="https://www.raspberrypi.com/software/" target="_blank" rel="noreferrer">Raspberry Pi Imager</a>
            </p>


          </div>
        </div>
      </div>

    </>
  );
}

export default Setup
