import { useState, useMemo } from 'react'
import { sortRows, filterRows, paginateRows } from '../helpers/providersTable.js'
import { Pagination } from './providersTablePagination.js'
import Avatar from 'boring-avatars';
import Router from 'next/router'
export const Table = ({ columns, rows }) => {
  const [activePage, setActivePage] = useState(1)
  const [filters, setFilters] = useState({})
  const [sort, setSort] = useState({ order: 'asc', orderBy: 'id' })
  const rowsPerPage = 35

  const filteredRows = useMemo(() => filterRows(rows, filters), [rows, filters])
  const sortedRows = useMemo(() => sortRows(filteredRows, sort), [filteredRows, sort])
  const calculatedRows = paginateRows(sortedRows, activePage, rowsPerPage)

  const count = filteredRows.length
  const totalPages = Math.ceil(count / rowsPerPage)

  const handleSearch = (value, accessor) => {
    setActivePage(1)

    if (value) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [accessor]: value,
      }))
    } else {
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters }
        delete updatedFilters[accessor]

        return updatedFilters
      })
    }
  }

  const handleSort = (accessor) => {
    setActivePage(1)
    setSort((prevSort) => ({
      order: prevSort.order === 'asc' && prevSort.orderBy === accessor ? 'desc' : 'asc',
      orderBy: accessor,
    }))
  }

  const clearAll = () => {
    setSort({ order: 'asc', orderBy: 'id' })
    setActivePage(1)
    setFilters({})
  }

  return (
    <>
      <div className="main p-8 text-xs">
        <div className="flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden ring-1 ring-black ring-opacity-5">

                <table className="min-w-full divide-y divide-gray-lightest dark:divide-gray-dark">
                  <thead className="bg-boring-white dark:bg-boring-black">
                    <tr>
                      {columns.map((column) => {
                        const sortIcon = () => {
                          if (column.accessor === sort.orderBy) {
                            if (sort.order === 'asc') {
                              return <span className="ml-4">↑</span>
                            }
                            return <span className="ml-4">↓</span>
                          } else {
                            return <span className="ml-4">↕</span>
                          }
                        }
                        return (
                          <th key={column.accessor} scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                            <span>{column.label}</span>
                            <button onClick={() => handleSort(column.accessor)}>{sortIcon()}</button>
                          </th>
                        )
                      })}
                    </tr>
                    <tr>
            {columns.map((column) => {
              return (
                <th
                  key={`${column.accessor}-th`}>
                  {/* <input
                    key={`${column.accessor}-search`}
                    type="search"
                    placeholder={`Search ${column.label}`}
                    value={filters[column.accessor]}
                    onChange={(event) => handleSearch(event.target.value, column.accessor)}
                  /> */}
                </th>
              )
            })}
          </tr>
                  </thead>
                  <tbody className="mt-24 divide-y divide-gray-lightest dark:divide-gray-dark">
                    {calculatedRows.map((row) => {
                      return (
                        <tr key={row.id} className="hover:bg-gray-lightestest dark:hover:bg-gray-dark cursor-pointer text-red">
                          {columns.map((column) => {
                            if (column.format) {
                              return <td className="whitespace-nowrap py-0 pl-4 pr-3 text-sm sm:pl-6" key={column.accessor}>{column.format(row[column.accessor])}</td>
                            }
                            return <td className="whitespace-nowrap py-2 pl-4 pr-3 text-sm sm:pl-6" key={column.accessor}>{row[column.accessor]}</td>
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {count > 0 ? (
        <Pagination
          activePage={activePage}
          count={count}
          rowsPerPage={rowsPerPage}
          totalPages={totalPages}
          setActivePage={setActivePage}
        />
      ) : (
        <p>No data found</p>
      )}

      <div>
        <p>
          <button onClick={clearAll}>Clear all</button>
        </p>
      </div>



      <nav
      className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6"
      aria-label="Pagination"
    >
      <div className="sm:block">
        <p className="text-sm text-gray-700">
          Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
          <span className="font-medium">20</span> results
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <a
          href="#"
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-s hover:bg-gray-dark"
        >
          Previous
        </a>
        <a
          href="#"
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </a>
      </div>
    </nav>

    
    </>
  )
}
