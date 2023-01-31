/* eslint-disable jsx-a11y/accessible-emoji 
*/

import { BiLastPage, BiRightArrowAlt, BiLeftArrowAlt, BiFirstPage } from "react-icons/bi";

export const Pagination = ({ activePage, count, rowsPerPage, totalPages, setActivePage }) => {
  const beginning = activePage === 1 ? 1 : rowsPerPage * (activePage - 1) + 1
  const end = activePage === totalPages ? count : beginning + rowsPerPage - 1

  return (
    <>

      <nav
        className="flex items-center justify-between px-4 py-3 sm:px-6 mt-4"
        aria-label="Pagination"
      >
        <div className="flex flex-1 justify-between sm:justify-end">
          <div>
            <button
              disabled={activePage === 1} onClick={() => setActivePage(1)}
              className="cursor-pointer mb-2 mr-2 inline-flex items-center rounded-sm border border-gray dark:border-black text-xs bg-white px-3 py-2 text-boring-black hover:bg-boring-white hover:opacity-70 active:opacity-50 shadow-md active:shadow-sm"
            >
              <BiFirstPage />
              <span className="ml-3">First</span>
            </button>
            <button
              disabled={activePage === 1} onClick={() => setActivePage(activePage - 1)}
              className="cursor-pointer mb-2 inline-flex items-center rounded-sm border border-gray dark:border-black text-xs bg-white px-3 py-2 text-boring-black hover:bg-boring-white hover:opacity-70 active:opacity-50 shadow-md active:shadow-sm"
            >
              <BiLeftArrowAlt />
              <span className="ml-3">Previous</span>
            </button>
          </div>
          <div>
            <button
              disabled={activePage === totalPages} onClick={() => setActivePage(activePage + 1)}
              className="cursor-pointer mb-2 mr-2 inline-flex items-center rounded-sm border border-gray dark:border-black text-xs bg-white px-3 py-2 text-boring-black hover:bg-boring-white hover:opacity-70 active:opacity-50 shadow-md active:shadow-sm"
            >
              Next
              <BiRightArrowAlt className="ml-3" />
            </button>
            <button
              disabled={activePage === totalPages} onClick={() => setActivePage(totalPages)}
              className="cursor-pointer mb-2 inline-flex items-center rounded-sm border border-gray dark:border-black text-xs bg-white px-3 py-2 text-boring-black hover:bg-boring-white hover:opacity-70 active:opacity-50 shadow-md active:shadow-sm"
            >
              Last
              <BiLastPage className="ml-3" />
            </button>
          </div>
        </div>
      </nav>

      <div className="pl-6 mt-2 mb-6">
        <p className="text-xs text-boring-black dark:text-boring-white">
          Page {activePage} of {totalPages}
        </p>
        <p className="text-xs text-boring-black dark:text-boring-white">
          Rows: {beginning === end ? end : `${beginning} - ${end}`} of {count}
        </p>
      </div>
    </>

  )
}
