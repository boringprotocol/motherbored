import { FaSpinner } from "react-icons/fa";

const PageLoader = () => {
  return (
    <>
      <div className="h-screen flex items-center justify-center">
        <div className="text-gray-500">
          <FaSpinner className="animate-spin h-6 w-6" />
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    </>
  );
}

export default PageLoader;
