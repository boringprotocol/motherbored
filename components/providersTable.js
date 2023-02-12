import { useState, useMemo } from 'react'
import { sortRows, filterRows, paginateRows } from '../helpers/providersTable.js'
import { Pagination } from './providersTablePagination.js'

export const Table = ({ columns, rows }) => {
  // useState hook to keep track of active page
  const [activePage, setActivePage] = useState(1)
  // useState hook to keep track of filter values
  const [filters, setFilters] = useState({})
  // useState hook to keep track of current sort
  const [sort, setSort] = useState({ order: 'asc', orderBy: 'id' })
  // number of rows to show per page
  const rowsPerPage = 35

  // useMemo hook to filter rows based on current filters
  const filteredRows = useMemo(() => filterRows(rows, filters), [rows, filters])
  // useMemo hook to sort filtered rows based on current sort
  const sortedRows = useMemo(() => sortRows(filteredRows, sort), [filteredRows, sort])
  // pagination of sorted and filtered rows
  const calculatedRows = paginateRows(sortedRows, activePage, rowsPerPage)

  // number of rows after filtering
  const count = filteredRows.length
  // total number of pages after filtering and pagination
  const totalPages = Math.ceil(count / rowsPerPage)

  // handle search input changes
  const handleSearch = (value, accessor) => {
    setActivePage(1)
    // if value is not empty, update the corresponding filter
    if (value) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [accessor]: value,
      }))
    } else {
    // if value is empty, delete the corresponding filter
      setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters }
        delete updatedFilters[accessor]

        return updatedFilters
      })
    }
  }
  // handle column header clicks for sorting
  const handleSort = (accessor) => {
    setActivePage(1)
    setSort((prevSort) => ({
      order: prevSort.order === 'asc' && prevSort.orderBy === accessor ? 'desc' : 'asc',
      orderBy: accessor,
    }))
  }

  // handle clear all filters and sorting
  const clearAll = () => {
    setSort({ order: 'asc', orderBy: 'id' })
    setActivePage(1)
    setFilters({})
  }

  return (
    <>

<div className="p-12 text-xs"><span className="text-xs text-gray">provider-directory:</span> all providers by name, country, and number of consumers connected.</div>

      <table className="w-full divide-gray-lightest dark:divide-gray-dark">
        <thead className="bg-boring-white dark:bg-boring-black">
          <tr className="mt-6">
            {columns.map((column) => {
              const sortIcon = () => {
                if (column.accessor === sort.orderBy) {
                  if (sort.order === 'asc') {
                    return <span className="ml-2">↑</span>
                  }
                  return <span className="ml-4">↓</span>
                } else {
                  return <span className="ml-4">↕</span>
                }
              }
              return (
                <th key={column.accessor} scope="col" className="pt-5 px-12 pr-3 text-left text-xs text-gray-light sm:pl-6">
                  <span>{column.label}</span>
                  <button className='' onClick={() => handleSort(column.accessor)}>{sortIcon()}</button>
                </th>
              )
            })}
          </tr>
          <tr>
            {columns.map((column) => {
              return (
                <th className="ml-0 pt-4 pb-4"
                  key={`${column.accessor}-th`}>
                  <input
                    className="ml-6 p-4 border-gray-light dark:border-gray-dark float-left text-xs text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black"
                    key={`${column.accessor}-search`}
                    type="search"
                    placeholder={`Search ${column.label}`}
                    value={filters[column.accessor]}
                    onChange={(event) => handleSearch(event.target.value, column.accessor)}
                  />
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="">
          {calculatedRows.map((row) => {
            return (
              <tr key={row.id} className="hover:bg-gray-lightest dark:hover:bg-gray-dark cursor-pointer  border-b border-gray-light dark:border-gray-dark">
                {columns.map((column) => {
                  if (column.format) {
                    return <td className="whitespace-nowrap py-0 px-12 pr-3 text-xs sm:pl-6" key={column.accessor}>{column.format(row[column.accessor])}</td>
                  }
                  return <td className="whitespace-nowrap py-2 px-12 pr-3 text-xs sm:pl-8" key={column.accessor}>{row[column.accessor]}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* if we are getting results show the pagination otherwise show nothing found */}
      {count > 0 ? (
        <Pagination
          activePage={activePage}
          count={count}
          rowsPerPage={rowsPerPage}
          totalPages={totalPages}
          setActivePage={setActivePage}
        />
      ) : (
        <p className="px-12 py-6 text-sm text-boring-black dark:text-boring-white">Nothing found.
          {/* lulz <Waiting /> */}
        </p>
      )}
      {/* Clear Filters */}
      <div className="ml-6 mb-6 text-xs">
        <p>
          <button onClick={clearAll} className="cursor-pointer mb-2 inline-flex items-center rounded-sm border border-gray dark:border-black text-xs bg-white px-3 py-2 text-boring-black hover:bg-boring-white hover:opacity-70 active:opacity-50 shadow-md active:shadow-sm">Clear Filters</button>
        </p>
      </div>
    </>
  )
}
