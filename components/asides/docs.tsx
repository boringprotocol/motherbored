import { IoLogoGithub } from "react-icons/io5";
import PapersArt from "../art/papers";

const Docs = () => {
    return ( 
        <>
        <div className="p-12 border-t border-gray-lightest dark:border-gray-dark">
                  <div className="container mx-auto relative">
                    <PapersArt />
                    <div className="text-sm  absolute top-0">
                      <h2 className="text-sm mb-2">Docs</h2>
                      <p className="text-xs mb-2">Motherbored set-up, VPS set-up, Development notes, etc...</p>

                      <a
                        href="https://github.com/boringprotocol/docs"
                        className="my-6 inline-flex items-center rounded-xs border border-gray dark:border-gray-dark text-xs bg-white dark:bg-black px-3 py-2 text-boring-black dark:text-gray-light hover:bg-boring-white hover:border-white hover:opacity-90 active:opacity-60 shadow-md dark:shadow-sm dark:shadow-black active:shadow-sm"
                      ><IoLogoGithub className="mr-2" />GitHub</a>
                      <div>

                      </div>
                    </div>
                  </div>
                </div>
                </>
     );
}
 
export default Docs;
