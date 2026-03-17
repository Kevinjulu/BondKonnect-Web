'use client'
import React, { useState, useMemo, useEffect } from 'react'
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable,} from '@tanstack/react-table'
import { ChevronDown, SlidersHorizontal, ArrowUpDown, Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger,} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@/components/ui/table'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "@/components/ui/card"
import { ScrollArea,ScrollBar } from "@/components/ui/scroll-area"
import { getStatsTable } from '@/lib/actions/api.actions'
import { Badge } from '@/components/ui/badge'

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
    cell: ({ row }) => <div className="text-right font-medium text-neutral-500">{row.index + 1}</div>,
    enableSorting: false,
    enableHiding: false,
    size: 60,
  },
  {
    accessorKey: 'BondIssueNo',
    header: 'Bond Issue',
    cell: ({ row }) => <div className="font-semibold text-black">{row.getValue('BondIssueNo')}</div>,
    size: 120,
  },
  // Bond Valuation Metrics columns
  {
    accessorKey: 'QuotedYield',
    header: 'Quoted Yield',
    cell: ({ row }) => <div className="text-center font-mono text-sm text-black">{row.getValue('QuotedYield')}</div>,
    sortingFn: 'alphanumeric',
    meta: { group: 'Bond Valuation Metrics' },
  },
  {
    accessorKey: 'IssueDate',
    header: 'Issue Date',
    cell: ({ row }) => <div className="text-center text-sm text-neutral-500">{row.getValue('IssueDate')}</div>,
    sortingFn: 'datetime',
    meta: { group: 'Bond Valuation Metrics' },
  },
  {
    accessorKey: 'MaturityDate',
    header: 'Maturity Date',
    cell: ({ row }) => <div className="text-center text-sm text-neutral-500">{row.getValue('MaturityDate')}</div>,
    sortingFn: 'datetime',
    meta: { group: 'Bond Valuation Metrics' },
  },
  {
    accessorKey: 'Coupon',
    header: 'Coupon',
    cell: ({ row }) => <div className="text-center font-mono text-sm text-black">{row.getValue('Coupon')}%</div>,
    sortingFn: 'basic',
    meta: { group: 'Bond Valuation Metrics' },
  },
  {
    accessorKey: 'NextCpnDays',
    header: 'Next Coupon (days)',
    cell: ({ row }) => <div className="text-center font-mono text-sm text-neutral-600">{row.getValue('NextCpnDays')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Bond Valuation Metrics' },
  },
  {
    accessorKey: 'DtmYrs',
    header: 'DTM (Yrs)',
    cell: ({ row }) => <div className="text-center font-mono text-sm text-neutral-600">{row.getValue('DtmYrs')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Bond Valuation Metrics' },
  },
  {
    accessorKey: 'DirtyPrice',
    header: 'Dirty Price',
    cell: ({ row }) => <div className="text-center font-mono text-sm font-bold text-black">{row.getValue('DirtyPrice')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Bond Valuation Metrics' },
  },
  {
    accessorKey: 'SpotYield',
    header: 'Yield',
    cell: ({ row }) => <div className="text-center font-mono text-sm text-black">{row.getValue('SpotYield')}%</div>,
    sortingFn: 'alphanumeric',
    meta: { group: 'Bond Valuation Metrics' },
  },
  // Risk Budgeting Indicators columns
  {
    accessorKey: 'Duration',
    header: 'Duration',
    cell: ({ row }) => <div className="text-center font-mono text-sm text-neutral-600">{row.getValue('Duration')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Risk Budgeting Indicators' },
  },
  {
    accessorKey: 'MDuration',
    header: 'M-Duration',
    cell: ({ row }) => <div className="text-center font-mono text-sm text-neutral-600">{row.getValue('MDuration')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Risk Budgeting Indicators' },
  },
  {
    accessorKey: 'Convexity',
    header: 'Convexity',
    cell: ({ row }) => <div className="text-center font-mono text-sm text-neutral-600">{row.getValue('Convexity')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Risk Budgeting Indicators' },
  },
  {
    accessorKey: 'Dv01',
    header: 'DV01',
    cell: ({ row }) => <div className="text-center font-mono text-sm text-neutral-600">{row.getValue('Dv01')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Risk Budgeting Indicators' },
  },
  {
    accessorKey: 'ExpectedShortfall',
    header: 'Exp. Shortfall',
    cell: ({ row }) => <div className="text-center font-mono text-sm text-neutral-600">{row.getValue('ExpectedShortfall')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Risk Budgeting Indicators' },
  },
  {
    accessorKey: 'ExpectedReturn',
    header: 'Exp. Return',
    cell: ({ row }) => <div className="text-center font-mono text-sm font-medium text-black">{row.getValue('ExpectedReturn')}%</div>,
    sortingFn: 'basic',
    meta: { group: 'Risk Budgeting Indicators' },
  },
  {
    accessorKey: 'Last91Days',
    header: 'Last 91 Days',
    cell: ({ row }) => <div className="text-center font-mono text-sm text-neutral-500">{row.getValue('Last91Days')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Risk Budgeting Indicators' },
  },
  {
    accessorKey: 'Last364Days',
    header: 'Last 364 Days',
    cell: ({ row }) => <div className="text-center font-mono text-sm text-neutral-500">{row.getValue('Last364Days')}</div>,
    sortingFn: 'basic',
    meta: { group: 'Risk Budgeting Indicators' },
  },
];

import { useStatsTable } from '@/hooks/use-portfolio-data'

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

  // Use the new hook
  const { data: rawData = [], isLoading: loading } = useStatsTable();

  const data = React.useMemo(() => {
    return (rawData ?? []).map((bond: any) => ({
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
      DirtyPrice: typeof bond.DirtyPrice === 'number' ? bond.DirtyPrice.toFixed(2) : bond.DirtyPrice,
      Coupon: typeof bond.Coupon === 'number' ? bond.Coupon.toFixed(4) : bond.Coupon, 
      NextCpnDays: bond.NextCpnDays,
      DtmYrs: typeof bond.DtmYrs === 'number' ? bond.DtmYrs.toFixed(4) : bond.DtmYrs,
      Dtc: typeof bond.Dtc === 'number' ? bond.Dtc.toFixed(4) : bond.Dtc,
      Duration: typeof bond.Duration === 'number' ? bond.Duration.toFixed(4) : bond.Duration,
      MDuration: typeof bond.MDuration === 'number' ? bond.MDuration.toFixed(4) : bond.MDuration,
      Convexity: typeof bond.Convexity === 'number' ? bond.Convexity.toFixed(4) : bond.Convexity,
      ExpectedReturn: typeof bond.ExpectedReturn === 'number' ? bond.ExpectedReturn.toFixed(4) : bond.ExpectedReturn,
      ExpectedShortfall: typeof bond.ExpectedShortfall === 'number' ? bond.ExpectedShortfall.toFixed(4) : bond.ExpectedShortfall,
      Dv01: typeof bond.Dv01 === 'number' ? bond.Dv01.toFixed(4) : bond.Dv01,
      Last91Days: bond.Last91Days,
      Last364Days: bond.Last364Days,
      LqdRank: bond.LqdRank,
      Spread: bond.Spread,
      CreditRiskPremium: bond.CreditRiskPremium,
      MdRank: bond.MdRank,
      ErRank: bond.ErRank,
      Basis: bond.Basis,
    }));
  }, [rawData]);

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
      <div className="flex flex-col items-center justify-center h-60 space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-black opacity-20" />
        <p className="text-sm font-medium text-neutral-500">Synchronizing bond data...</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <Card className="w-full shadow-sm border border-neutral-200 bg-white">
        <CardHeader className="pb-4 border-b border-neutral-100 bg-neutral-50 rounded-t-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl font-bold text-black">Bond Statistics</CardTitle>
              <CardDescription className="text-neutral-500 mt-1">
                Comprehensive bond valuation metrics and risk indicators
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right bg-white px-4 py-2 rounded-lg border border-neutral-200">
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Total Bonds</p>
                <p className="text-xl font-bold text-black leading-none mt-1">{data.length}</p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search bonds, yields, prices..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-10 bg-white border-neutral-200 text-black focus:ring-black focus:border-black"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-black text-white hover:bg-neutral-800 border-black">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Customize View ({Object.values(columnVisibility).filter(Boolean).length + Object.keys(columnVisibility).filter(key => columnVisibility[key] === undefined).length})
                  <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[280px] max-h-[400px] overflow-y-auto bg-white border border-neutral-200 text-black">
                {Object.entries(columnGroups).map(([groupName, groupColumns]) => (
                  <div key={groupName} className="p-2">
                    <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 px-2">
                      {groupName}
                    </div>
                    {groupColumns.map((column) => {
                      const columnKey = (column as any).accessorKey || column.id
                      const tableColumn = table.getColumn(columnKey)
                      if (!tableColumn || !tableColumn.getCanHide()) return null
                      
                      return (
                        <DropdownMenuCheckboxItem
                          key={columnKey}
                          className="capitalize pl-4 text-sm focus:bg-neutral-100 focus:text-black"
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
          <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <ScrollArea className="w-full">
              <div className="min-w-[1200px]">
                {loading ? (
                  <LoadingSpinner />
                ) : (
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className="bg-neutral-50 border-b border-neutral-200 hover:bg-neutral-50">
                          {headerGroup.headers.map((header) => {
                            const column = header.column
                            const canSort = column.getCanSort()
                            
                            return (
                              <TableHead 
                                key={header.id} 
                                className="h-12 px-4 text-left align-middle font-semibold text-neutral-600 border-r border-neutral-100 last:border-r-0"
                                style={{ width: header.getSize() }}
                              >
                                {header.isPlaceholder ? null : (
                                  <div
                                    className={`flex items-center space-x-2 ${canSort ? 'cursor-pointer select-none hover:text-black transition-colors' : ''}`}
                                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                                  >
                                    <span className="text-xs font-bold uppercase tracking-wider">
                                      {flexRender(header.column.columnDef.header, header.getContext())}
                                    </span>
                                    {canSort && (
                                      <ArrowUpDown className="h-3 w-3 text-neutral-400" />
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
                            className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors bg-white"
                            data-state={row.getIsSelected() && "selected"}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell 
                                key={cell.id} 
                                className="px-4 py-3 text-sm border-r border-neutral-50 last:border-r-0 text-black"
                              >
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length} className="h-60 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3 text-neutral-400">
                              <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-2">
                                <Search className="w-6 h-6 opacity-20 text-black" />
                              </div>
                              <div>
                                <p className="text-lg font-bold text-black">No bond data found</p>
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
              <ScrollBar orientation="horizontal" className="bg-neutral-100" />
            </ScrollArea>
          </div>
        </CardContent>

        <CardFooter className="bg-white border-t border-neutral-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4">
            <div className="flex items-center space-x-2 text-sm text-neutral-500">
              <span className="font-medium text-black">
                {table.getFilteredRowModel().rows.length}
              </span>
              <span>records found</span>
              <span>•</span>
              <span>
                Page <span className="font-medium text-black">{table.getState().pagination.pageIndex + 1}</span> of <span className="font-medium text-black">{table.getPageCount()}</span>
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="bg-black text-white hover:bg-neutral-800 border-none"
              >
                Previous
              </Button>
              <Button
                variant="outline" 
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="bg-black text-white hover:bg-neutral-800 border-none"
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
