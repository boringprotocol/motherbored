import { IoLogoGithub } from "react-icons/io5"
import PapersArt from "../art/papers"

const Docs = () => {
  return (
    <>

      <div className="card border-t border-base-200 pt-12">
        <div className="card-body container mx-auto relative">
          <PapersArt />
          <div className="prose absolute top-0">
            <h2 className="card-title text-base">Docs</h2>
            <p className="text-xs">Motherbored set-up, VPS set-up, Development notes, etc...</p>

            <a
              href="https://github.com/boringprotocol/docs"
              className="btn btn-outline btn-outline-bla"
            ><IoLogoGithub className="mr-2" />GitHub</a>
            <div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Docs
