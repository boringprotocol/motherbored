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
                        className="mb-2 inline-flex items-center rounded-sm border border-gray dark:border-black text-xs bg-white px-3 py-2 text-boring-black hover:bg-boring-white hover:opacity-70 active:opacity-50 shadow-md active:shadow-sm"
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
