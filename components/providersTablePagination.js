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
          className="disabled:bg-red relative inline-flex items-center rounded-sm border border-gray px-3 py-1 text-sm font-medium text-gray-light dark:text-gray-dark hover:bg-gray-50"
        >
          <BiFirstPage />
          <span className="ml-3">First</span>
        </button>
        <button
          disabled={activePage === 1} onClick={() => setActivePage(activePage - 1)}
          className="relative ml-3 inline-flex items-center rounded-sm border border-gray px-3 py-1 text-sm font-medium text-gray-light dark:text-gray-dark hover:bg-gray-50"
        >
          <BiLeftArrowAlt />
          <span className="ml-3">Previous</span>
        </button>
        </div>
        <div>
        <button
          disabled={activePage === totalPages} onClick={() => setActivePage(activePage + 1)}
          className="relative inline-flex items-center rounded-sm border border-gray px-3 py-1 text-sm font-medium text-gray-light dark:text-gray-dark hover:bg-gray-50"
        >
          Next
          <BiRightArrowAlt className="ml-3" />
        </button>
        <button
          disabled={activePage === totalPages} onClick={() => setActivePage(totalPages)}
          className="relative ml-3 inline-flex items-center rounded-sm border border-gray px-3 py-1 text-sm font-medium text-gray-light dark:text-gray-dark hover:bg-gray-50"
        >
          Last
          <BiLastPage className="ml-3" />
        </button>
        </div>
      </div>
    </nav>
        
    <div className="pl-6 mt-2 mb-6">
      <p className="text-xs text-gray-light">
        Page {activePage} of {totalPages}
      </p>
      <p className="text-xs text-gray-light">
        Rows: {beginning === end ? end : `${beginning} - ${end}`} of {count}
      </p>
    </div>
  </>

    )
  }
  