import { IoWaterOutline } from "react-icons/io5";

// import all the styles
import "react-rain-animation/lib/style.css";

const AirdripAd = () => {
  return (
    <>
      <div className="sm:px-0">

        <h1 className="text-3xl flex items-center">
          <span className="mr-1">
            <IoWaterOutline />
          </span>
          aird.rip
        </h1>

        <h2 className="text-xs ml-6">from Boring Protocol</h2>
        <p className="mx-2 mt-4 text-xs">We are creating aird.rip to provide a place for projects to distribute spl-tokens.</p>
        <p className="mx-2 mt-4 text-xs">Create your own project page, access our whitelist tools, and build claims links. <a className="link" href="/airdrip">Learn more</a></p>

      </div>
    </>
  );
}

export default AirdripAd;
