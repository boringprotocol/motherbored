import { useState, useMemo } from 'react'
import { sortRows, filterRows, paginateRows } from '../helpers/providersTable.js'
// import Waiting from './art/waiting.tsx'
import { Pagination } from './providersTablePagination.js'
// import Avatar from 'boring-avatars';
// import Router from 'next/router'
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
                <table className="w-full divide-y divide-gray-lightest dark:divide-gray-dark">
                  <thead className="bg-boring-white dark:bg-boring-black">
                    <tr className="mt-6">
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
                <th className="ml-0 pt-4 pb-4"
                  key={`${column.accessor}-th`}>
                  <input
                    className="ml-6 border-gray-dark float-left text-xs text-boring-black dark:text-boring-white bg-boring-white dark:bg-boring-black"
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
                        <tr key={row.id} className="hover:bg-gray-lightestest dark:hover:bg-gray-dark cursor-pointer divide-y border-gray-lightest dark:border-gray-dark dark:divide-gray-dark border-b">
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
              

      {count > 0 ? (
        <Pagination
          activePage={activePage}
          count={count}
          rowsPerPage={rowsPerPage}
          totalPages={totalPages}
          setActivePage={setActivePage}
        />
      ) : (
        <p className="px-6 py-6 text-sm text-boring-black dark:text-boring-white">Nothing found.
        {/* lulz <Waiting /> */}
        </p>
      )}

      {/* <div className="ml-6 mb-6 text-xs">

        // Clear results 
        <p>
          <button onClick={clearAll} className="rounded-sm border border-gray px-3 py-1 text-sm font-medium text-gray-light dark:text-gray-dark hover:bg-gray-50">Clear all</button>
        </p>
      </div> */}
    
    </>
  )
}
