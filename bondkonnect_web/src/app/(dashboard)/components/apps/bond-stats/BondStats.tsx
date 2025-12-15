'use client'
import React, { useState, useMemo, useEffect } from 'react'
// import * as React from 'react'
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable,} from '@tanstack/react-table'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { Checkbox } from '@/app/components/ui/checkbox'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,} from '@/app/components/ui/dropdown-menu'
import { Input } from '@/app/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/app/components/ui/table'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/app/components/ui/card"
import { ScrollArea,ScrollBar } from "@/app/components/ui/scroll-area"
import { getStatsTable } from '@/app/lib/actions/api.actions'
import { Icons } from '@/app/components/icons'
import PageContainer from '../../container/PageContainer'

interface BondData {
  Otr: string | null;
  Filter1: string | null;
  Filter2: string | null;
  Id_: string | null;
  BondIssueNo: string | null;
  IssueDate: string | null;
  MaturityDate: string | null;
  ValueDate: string | null;
  QuotedYield: string | null;
  SpotYield: string | null;
  DirtyPrice: string | null;
  Coupon: string | null;
  NextCpnDays: string | null;
  DtmYrs: string | null;
  Dtc: string | null;
  Duration: string | null;
  MDuration: string | null;
  Convexity: string | null;
  ExpectedReturn: string | null;
  ExpectedShortfall: string | null;
  Dv01: string | null;
  Last91Days: string | null;
  Last364Days: string | null;
  LqdRank: string | null;
  Spread: string | null;
  CreditRiskPremium: string | null;
  MdRank: string | null;
  ErRank: string | null;
  Basis: string | null;
  // IndicativeBidAsk: string | null;
}

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    group?: string;
  }
}

// Flattened column structure for proper visibility control
const columns: ColumnDef<BondData>[] = [
  {
    accessorKey: 'rowNumber',
    header: '#',
    cell: ({ row }) => <div className="text-right font-medium text-slate-600">{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
    size: 60,
  },
  {
    accessorKey: 'BondIssueNo',
    header: 'Bond Issue',
    cell: ({ row }) => <div className="font-semibold text-slate-900">{row.getValue('BondIssueNo')}</div>,
    size: 120,
  },
  // Bond Valuation Metrics columns
  {
    accessorKey: 'QuotedYield',
    header: 'Quoted Yield',
    cell: ({ row }) => <div className="text-center font-mono text-sm">{row.getValue('QuotedYield')}</div>,
    sortingFn: 'alphanumeric',
    meta: { group: 'Bond Valuation Metrics' },
  },
  {
    accessorKey: 'IssueDate',
    header: 'Issue Date',
    cell: ({ row }) => <div className="text-center text-sm text-slate-600">{row.getValue('IssueDate')}</div>,
    sortingFn: 'datetime',
    meta: { group: 'Bond Valuation Metrics' },
  },
  {
    accessorKey: 'MaturityDate',
    header: 'Maturity Date',
    cell: ({ row }) => <div className="text-center text-sm text-slate-600">{row.getValue('MaturityDate')}</div>,
    sortingFn: 'datetime',
    meta: { group: 'Bond Valuation Metrics' },
  },
  {
    accessorKey: 'Coupon',
    header: 'Coupon',
    cell: ({ row }) => <div className="text-center font-mono text-sm">{row.getValue('Coupon')}%</div>,
    sortingFn: 'basic',
    meta: { group: 'Bond Valuation Metrics' },
  },
  {
    accessorKey: 'NextCpnDays',
    header: 'Next Coupon (days)',
    cell: ({ row }) => <div className="text-center font-mono text-sm">{row.getValue('NextCpnDays')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Bond Valuation Metrics' },
  },
  {
    accessorKey: 'DtmYrs',
    header: 'DTM (Yrs)',
    cell: ({ row }) => <div className="text-center font-mono text-sm">{row.getValue('DtmYrs')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Bond Valuation Metrics' },
  },
  {
    accessorKey: 'DirtyPrice',
    header: 'Dirty Price',
    cell: ({ row }) => <div className="text-center font-mono text-sm font-semibold text-green-700">{row.getValue('DirtyPrice')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Bond Valuation Metrics' },
  },
  {
    accessorKey: 'SpotYield',
    header: 'Yield',
    cell: ({ row }) => <div className="text-center font-mono text-sm">{row.getValue('SpotYield')}%</div>,
    sortingFn: 'alphanumeric',
    meta: { group: 'Bond Valuation Metrics' },
  },
  // Risk Budgeting Indicators columns
  {
    accessorKey: 'Duration',
    header: 'Duration',
    cell: ({ row }) => <div className="text-center font-mono text-sm">{row.getValue('Duration')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Risk Budgeting Indicators' },
  },
  {
    accessorKey: 'MDuration',
    header: 'M-Duration',
    cell: ({ row }) => <div className="text-center font-mono text-sm">{row.getValue('MDuration')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Risk Budgeting Indicators' },
  },
  {
    accessorKey: 'Convexity',
    header: 'Convexity',
    cell: ({ row }) => <div className="text-center font-mono text-sm">{row.getValue('Convexity')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Risk Budgeting Indicators' },
  },
  {
    accessorKey: 'Dv01',
    header: 'DV01',
    cell: ({ row }) => <div className="text-center font-mono text-sm">{row.getValue('Dv01')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Risk Budgeting Indicators' },
  },
  {
    accessorKey: 'ExpectedShortfall',
    header: 'Expected Shortfall',
    cell: ({ row }) => <div className="text-center font-mono text-sm text-red-600">{row.getValue('ExpectedShortfall')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Risk Budgeting Indicators' },
  },
  {
    accessorKey: 'ExpectedReturn',
    header: 'Expected Return',
    cell: ({ row }) => <div className="text-center font-mono text-sm text-green-600">{row.getValue('ExpectedReturn')}%</div>,
    sortingFn: 'basic',
    meta: { group: 'Risk Budgeting Indicators' },
  },
  {
    accessorKey: 'Last91Days',
    header: 'Last 91 Days',
    cell: ({ row }) => <div className="text-center font-mono text-sm">{row.getValue('Last91Days')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Risk Budgeting Indicators' },
  },
  {
    accessorKey: 'Last364Days',
    header: 'Last 364 Days',
    cell: ({ row }) => <div className="text-center font-mono text-sm">{row.getValue('Last364Days')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Risk Budgeting Indicators' },
  },
];

export function BondStats() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({
    // Set default visibility - hide some columns initially to prevent overcrowding
    Last91Days: false,
    Last364Days: false,
    Dv01: false,
    NextCpnDays: false,
  })
  const [globalFilter, setGlobalFilter] = React.useState('')
  const [pageSize, setPageSize] = useState(10)
  const [data, setData] = useState<BondData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const result = await getStatsTable()
        const formattedData = (result ?? []).map((bond: any) => ({
          Otr: bond.Otr,
          Filter1: bond.Filter1,
          Filter2: bond.Filter2,
          Id_: bond.Id_,
          BondIssueNo: bond.BondIssueNo,
          IssueDate: bond.IssueDate ? new Date(bond.IssueDate).toLocaleDateString() : null,
          MaturityDate: bond.MaturityDate ? new Date(bond.MaturityDate).toLocaleDateString() : null,
          ValueDate: bond.ValueDate ? new Date(bond.ValueDate).toLocaleDateString() : null,
          QuotedYield: bond.QuotedYield,
          SpotYield: bond.SpotYield,
          DirtyPrice: bond.DirtyPrice?.toFixed(2),
          Coupon: bond.Coupon?.toFixed(4), 
          NextCpnDays: bond.NextCpnDays,
          DtmYrs: bond.DtmYrs?.toFixed(4),
          Dtc: bond.Dtc?.toFixed(4),
          Duration: bond.Duration?.toFixed(4),
          MDuration: bond.MDuration?.toFixed(4),
          Convexity: bond.Convexity?.toFixed(4),
          ExpectedReturn: bond.ExpectedReturn?.toFixed(4),
          ExpectedShortfall: bond.ExpectedShortfall?.toFixed(4),
          Dv01: bond.Dv01?.toFixed(4),
          Last91Days: bond.Last91Days,
          Last364Days: bond.Last364Days,
          LqdRank: bond.LqdRank,
          Spread: bond.Spread,
          CreditRiskPremium: bond.CreditRiskPremium,
          MdRank: bond.MdRank,
          ErRank: bond.ErRank,
          Basis: bond.Basis,
        }));
        setData(formattedData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching stats table data:', error)
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  })

  // Group columns for organized visibility menu
  const columnGroups = useMemo(() => {
    const groups: { [key: string]: typeof columns } = {
      'Basic Info': [],
      'Bond Valuation Metrics': [],
      'Risk Budgeting Indicators': [],
    }
    
    columns.forEach(column => {
      const key = (column as any).accessorKey || column.id
      if (key === 'rowNumber' || key === 'BondIssueNo') {
        groups['Basic Info'].push(column)
      } else if (column.meta?.group === 'Bond Valuation Metrics') {
        groups['Bond Valuation Metrics'].push(column)
      } else if (column.meta?.group === 'Risk Budgeting Indicators') {
        groups['Risk Budgeting Indicators'].push(column)
      }
    })
    
    return groups
  }, [])

  const LoadingSpinner = () => {
    return (
      <div className="flex flex-col items-center justify-center h-32 space-y-2">
        <Icons.spinner className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-slate-500">Loading bond data...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Card className="w-full shadow-lg border-0 bg-gradient-to-br from-white to-slate-50">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">Bond Statistics</CardTitle>
              <CardDescription className="text-blue-100 mt-1">
                Comprehensive bond valuation metrics and risk indicators
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-blue-100">Total Bonds</p>
                <p className="text-lg font-bold">{data.length}</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Input
                placeholder="Search bonds, yields, prices..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
              <Icons.spinner className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-slate-300 hover:bg-slate-50">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Customize View ({Object.values(columnVisibility).filter(Boolean).length + Object.keys(columnVisibility).filter(key => columnVisibility[key] === undefined).length})
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[280px] max-h-[400px] overflow-y-auto">
                {Object.entries(columnGroups).map(([groupName, groupColumns]) => (
                  <div key={groupName} className="p-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 px-2">
                      {groupName}
                    </div>
                    {groupColumns.map((column) => {
                      const columnKey = (column as any).accessorKey || column.id
                      const tableColumn = table.getColumn(columnKey)
                      if (!tableColumn || !tableColumn.getCanHide()) return null
                      
                      return (
                        <DropdownMenuCheckboxItem
                          key={columnKey}
                          className="capitalize pl-4 text-sm"
                          checked={tableColumn.getIsVisible()}
                          onCheckedChange={(checked) => tableColumn.toggleVisibility(checked)}
                        >
                          {typeof column.header === 'string' ? column.header : columnKey}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table Container */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <ScrollArea className="w-full">
              <div className="min-w-[1200px]"> {/* Minimum width for horizontal scroll */}
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
                          {headerGroup.headers.map((header) => {
                            const column = header.column
                            const canSort = column.getCanSort()
                            
                            return (
                              <TableHead 
                                key={header.id} 
                                className="h-12 px-4 text-left align-middle font-semibold text-slate-700 border-r border-slate-200 last:border-r-0"
                                style={{ width: header.getSize() }}
                              >
                                {header.isPlaceholder ? null : (
                                  <div
                                    className={`flex items-center space-x-2 ${canSort ? 'cursor-pointer select-none hover:text-slate-900' : ''}`}
                                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                                  >
                                    <span className="text-xs uppercase tracking-wide">
                                      {flexRender(header.column.columnDef.header, header.getContext())}
                                    </span>
                                    {canSort && (
                                      <span className="text-slate-400">
                                        {{
                                          asc: '↑',
                                          desc: '↓',
                                        }[header.column.getIsSorted() as string] ?? '↕'}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </TableHead>
                            )
                          })}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row, index) => (
                          <TableRow 
                            key={row.id} 
                            className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-25'}`}
                            data-state={row.getIsSelected() && "selected"}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell 
                                key={cell.id} 
                                className="px-4 py-3 text-sm border-r border-slate-100 last:border-r-0"
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="h-32 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3 text-slate-500">
                              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                <Icons.spinner className="w-6 h-6" />
                              </div>
                              <div>
                                <p className="text-lg font-medium">No bond data found</p>
                                <p className="text-sm">Try adjusting your search or filters</p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </CardContent>

        <CardFooter className="bg-slate-50 border-t border-slate-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <span>
                Showing {table.getFilteredRowModel().rows.length} of {data.length} bonds
              </span>
              <span>•</span>
              <span>
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="border-slate-300 hover:bg-slate-100"
              >
                Previous
              </Button>
              <Button
                variant="outline" 
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="border-slate-300 hover:bg-slate-100"
              >
                Next
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}