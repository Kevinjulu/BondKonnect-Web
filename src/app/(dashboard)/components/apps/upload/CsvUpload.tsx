"use client"
import * as React from 'react'
import { Check, FileIcon, Upload, X, FileText, MousePointer2, CloudUpload, AlertCircle } from 'lucide-react'
import Papa from 'papaparse'
import axios from '@/utils/axios'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const tableMapping = {
  'Stats Table': 'statstable',
  'Graph Table': 'graphtable',
  'OBI Table': 'obitable',
  'YTM Table': 'ytmtable',
  'Primary Market': 'primarymarkettable'
}

// CSV Headers for validation
const headers = {
  'Stats Table': ['otr', 'Filter1', 'Filter2', 'ID', 'Bond Issue No', 'Issue Date', 'Maturity Date', 'Value Date', 'Quoted Yield', 'Spot Yield', 'Dirty Price', 'Coupon', 'Next Cpn (Days)', 'DTM (Yrs)', 'DTC', 'Duration', 'M Duration', 'Convexity', 'Expected Return', 'Expected Shortfall', 'DV01', 'Last 91 Days', 'Last 364 Days', 'LQD Rank', 'Spread', 'Credit Risk premium', 'MD Rank', 'ER Rank', 'Basis'],
  'Graph Table': ['Date', 'Year', 'Spot rate', 'Nse rate', 'Upper band', 'Lower band'],
  'OBI Table': ['Date', 'Quoted Yield', 'Spot Yield', 'Dirty Price', 'OBI (K) Index', 'Coupon', 'Duration', 'Expected Return', 'DV01', 'Expected Shortfall', 'OBI TR'],
  'YTM Table': ['Date', 'taylor Rule', 'Ceiling', 'Floor', 'lamda1', 'lamda2', 'Alpha', 'Beta1', 'Beta2', 'Beta3', 'CBR', 'Rate Projection', 'Inflation', 'Level', 'Slope', 'Carvature'],
  'Primary Market': ['Bond Issues', 'Issue Date', 'Maturity Date', 'Value Date', '1st Call Date', '2nd Call Date', 'Par Call 1 (%)', 'Par Call 2 (%)', 'Pricing Method', 'DTM / WAL', 'Day-Count', '1st coupon date', '2nd coupon date', 'Spot Rate (%)', 'Par Yield (%)']
}

// Database column mapping
const columnMapping = {
  'Stats Table': {
    'otr': 'Otr',
    'Filter1': 'Filter1',
    'Filter2': 'Filter2',
    'ID': 'Id_',
    'Bond Issue No': 'BondIssueNo',
    'Issue Date': 'IssueDate',
    'Maturity Date': 'MaturityDate',
    'Value Date': 'ValueDate',
    'Quoted Yield': 'QuotedYield',
    'Spot Yield': 'SpotYield',
    'Dirty Price': 'DirtyPrice',
    'Coupon': 'Coupon',
    'Next Cpn (Days)': 'NextCpnDays',
    'DTM (Yrs)': 'DtmYrs',
    'DTC': 'Dtc',
    'Duration': 'Duration',
    'M Duration': 'MDuration',
    'Convexity': 'Convexity',
    'Expected Return': 'ExpectedReturn',
    'Expected Shortfall': 'ExpectedShortfall',
    'DV01': 'Dv01',
    'Last 91 Days': 'Last91Days',
    'Last 364 Days': 'Last364Days',
    'LQD Rank': 'LqdRank',
    'Spread': 'Spread',
    'Credit Risk premium': 'CreditRiskPremium',
    'MD Rank': 'MdRank',
    'ER Rank': 'ErRank',
    'Basis': 'Basis'
  },
  'Graph Table': {
    'Date': 'Date',
    'Year': 'Year',
    'Spot rate': 'SpotRate',
    'Nse rate': 'NseRate',
    'Upper band': 'UpperBand',
    'Lower band': 'LowerBand'
  },
  'OBI Table': {
    'Date': 'Date',
    'Quoted Yield': 'QuotedYield',
    'Spot Yield': 'SpotYield',
    'Dirty Price': 'DirtyPrice',
    'OBI (K) Index': 'ObiKIndex',
    'Coupon': 'Coupon',
    'Duration': 'Duration',
    'Expected Return': 'ExpectedReturn',
    'DV01': 'Dv01',
    'Expected Shortfall': 'ExpectedShortfall',
    'OBI TR': 'ObiTr'
  },
  'YTM Table': {
    'Date': 'Date',
    'taylor Rule': 'TaylorRule',
    'Ceiling': 'Ceiling',
    'Floor': 'Floor',
    'lamda1': 'Lamda1',
    'lamda2': 'Lamda2',
    'Alpha': 'Alpha',
    'Beta1': 'Beta1',
    'Beta2': 'Beta2',
    'Beta3': 'Beta3',
    'CBR': 'Cbr',
    'Rate Projection': 'RateProjection',
    'Inflation': 'Inflation',
    'Level': 'Level',
    'Slope': 'Slope',
    'Carvature': 'Carvature'
  },
  'Primary Market': {
    'Bond Issues': 'BondIssueNo',
    'Issue Date': 'IssueDate',
    'Maturity Date': 'MaturityDate',
    'Value Date': 'ValueDate',
    '1st Call Date': 'FirstCallDate',
    '2nd Call Date': 'SecondCallDate',
    'Par Call 1 (%)': 'ParCall1Percent',
    'Par Call 2 (%)': 'ParCall2Percent',
    'Pricing Method': 'PricingMethod',
    'DTM / WAL': 'DtmOrWal',
    'Day-Count': 'DayCount',
    '1st coupon date': 'FirstCouponDate',
    '2nd coupon date': 'SecondCouponDate',
    'Spot Rate (%)': 'SpotRate',
    'Par Yield (%)': 'ParYield'
  }
}

interface FileWithPreview extends File {
  progress: number
  status: 'uploading' | 'complete' | 'error'
  preview: string[][]
}
export default function UploadCsv() {
  const { toast } = useToast()
  const [documentType, setDocumentType] = React.useState<keyof typeof headers | ''>('')
  const [files, setFiles] = React.useState<FileWithPreview[]>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const [uploading, setUploading] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const validateHeaders = (fileHeaders: string[], expectedHeaders: string[]) => {
    return JSON.stringify(fileHeaders.map(h => h.trim().toLowerCase())) ===
      JSON.stringify(expectedHeaders.map(h => h.trim().toLowerCase()))
  }

  const processFile = async (file: File): Promise<FileWithPreview> => {
    return new Promise((resolve, reject) => {
      if (!documentType) {
        reject(new Error('Please select a document type first'))
        return
      }

      Papa.parse(file, {
        complete: (results) => {
          const fileHeaders = results.data[0] as string[]
          const expectedHeaders = headers[documentType]

          if (!validateHeaders(fileHeaders, expectedHeaders)) {
            reject(new Error(`Invalid headers for ${documentType}`))
            return
          }

          const fileWithPreview = {
            ...file,
            progress: 100,
            status: 'complete' as const,
            preview: results.data as string[][]
          }
          resolve(fileWithPreview)
        },
        error: (error) => reject(new Error(error.message))
      })
    })
  }

  const mapDataToDbColumns = (data: any[], docType: string) => {
    return data.map(row => {
      const mappedRow: { [key: string]: any } = {}
      Object.entries(row).forEach(([key, value]) => {
        const dbColumn = columnMapping[docType as keyof typeof columnMapping][key as keyof typeof columnMapping[keyof typeof columnMapping]]
        if (dbColumn && value !== '' && value !== undefined) {
          mappedRow[dbColumn] = value
        }
      })
      return mappedRow
    }).filter(row => Object.keys(row).length > 0) // Remove empty objects
  }

  const handleFiles = async (newFiles: File[]) => {
    if (!documentType) {
      toast({
        title: "Error",
        description: "Please select a document type first",
        variant: "destructive"
      })
      return
    }

    setUploading(true)
    for (const file of newFiles) {
      if (file.type !== 'text/csv') {
        toast({
          title: "Error",
          description: "Please upload CSV files only",
          variant: "destructive"
        })
        continue
      }

      try {
        const processedFile = await processFile(file)
        setFiles(prev => [...prev, processedFile])
        toast({
          title: "Success",
          description: `${file.name} uploaded successfully`,
          variant: "default"
        })
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to process file',
          variant: "destructive"
        })
      }
    }
    setUploading(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    await handleFiles(droppedFiles)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    await handleFiles(selectedFiles)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (fileToRemove: FileWithPreview) => {
    setFiles(files.filter(file => file !== fileToRemove))
    toast({
      title: "File Removed",
      description: `${fileToRemove.name} has been removed`,
      variant: "default"
    })
  }

  const handleUploadData = async () => {
    if (!documentType) {
      toast({
        title: "Error",
        description: "Please select a document type",
        variant: "destructive"
      })
      return
    }

    setUploading(true)
    try {
      // Process all files and prepare data
      const allData = files.flatMap(file => {
        const [headers, ...rows] = file.preview
        return rows.map(row => {
          const obj: { [key: string]: string } = {}
          headers.forEach((header, index) => {
            obj[header.trim()] = row[index]
          })
          return obj
        })
      })

      // Map CSV columns to database columns
      const mappedData = mapDataToDbColumns(allData, documentType)
      const datatoUplaod = {
        table: tableMapping[documentType as keyof typeof tableMapping],
        data: mappedData
      }

      // Send data to API
      const response = await axios.post('/v1/auth/upload-data', {
        table: tableMapping[documentType as keyof typeof tableMapping],
        data: mappedData
      })

      toast({
        title: "Success",
        description: `${response.data.record_count} records uploaded successfully`,
        variant: "default"
      })

      // Clear files after successful upload
      setFiles([])

    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to upload data',
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }


  return (
    <Card className="w-full max-w-4xl mx-auto shadow-sm border-neutral-200 bg-white">
      <CardHeader className="pb-4 border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-black flex items-center gap-2">
              <Upload className="h-5 w-5" />
              System Data Upload
            </CardTitle>
            <CardDescription className="text-neutral-500 mt-1 max-w-2xl">
              Update the core market data for BondKonnect, including Bond Statistics (Secondary Market), Primary Market issues, Yield Curves, and OBI Indices.
            </CardDescription>
          </div>
          {files.length > 0 && (
             <Button onClick={handleUploadData} className="bg-black text-white hover:bg-neutral-800 transition-colors">
             Upload {files.length} File{files.length !== 1 ? 's' : ''}
           </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-8 p-6">
        
        {/* Selection Area */}
        <div className="grid md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-4 space-y-2">
            <label className="text-sm font-semibold leading-none text-black">
              1. Document Type
            </label>
            <Select value={documentType} onValueChange={(value) => setDocumentType(value as keyof typeof headers)}>
              <SelectTrigger className="w-full h-11 bg-neutral-50 border-neutral-200 focus:ring-black focus:border-black text-black text-sm">
                <SelectValue placeholder="Select the type of data you are uploading..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-neutral-200 shadow-md">
                {Object.keys(headers).map((type) => (
                  <SelectItem key={type} value={type} className="text-black hover:bg-neutral-50 focus:bg-neutral-50 focus:text-black py-3">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Drop Zone */}
        <div className="space-y-2">
           <label className="text-sm font-semibold leading-none text-black">
              2. Upload File
            </label>
          <div
            className={`group relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ease-in-out cursor-pointer
              ${isDragging
                ? 'border-black bg-neutral-100 scale-[1.005]'
                : 'border-neutral-200 bg-neutral-50/50 hover:border-black/30 hover:bg-neutral-100/50'
              }`}
            onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={handleFileSelect}
              multiple
            />
            <div className="pointer-events-none flex flex-col items-center justify-center gap-4 transition-transform group-hover:-translate-y-1">
              <div className="rounded-full bg-white p-4 shadow-sm border border-neutral-100 group-hover:border-neutral-200 transition-colors">
                <CloudUpload className="h-8 w-8 text-black" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-black">
                  Click or drag file to this area to upload
                </p>
                <p className="text-sm text-neutral-500">
                  Support for a single or bulk upload. Strictly .csv files.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Attached Files List */}
        {files.length > 0 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-sm font-semibold text-black border-b border-neutral-100 pb-2">Ready for Upload</h3>
            <div className="grid gap-3">
              {files.map((file, index) => (
                <div key={index} className="group relative overflow-hidden border border-neutral-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-neutral-50 border border-neutral-200 flex items-center justify-center shrink-0">
                      <FileIcon className="h-5 w-5 text-black" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium truncate text-sm text-black">{file.name}</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeFile(file); }}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                         <div className="h-1.5 flex-1 rounded-full bg-neutral-100 overflow-hidden">
                          <div className="h-full bg-black rounded-full" style={{ width: '100%' }} />
                        </div>
                        <Badge variant="secondary" className="bg-black text-white hover:bg-black/90 text-[10px] h-5 px-2">
                           Ready
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview Section */}
                  {file.preview && (
                    <div className="border-t border-neutral-100 bg-neutral-50/30">
                       <div className="px-4 py-2">
                        <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Preview</p>
                       </div>
                       <div className="overflow-x-auto pb-2 px-4">
                         <Table>
                           <TableHeader>
                             <TableRow className="hover:bg-transparent border-none">
                               {file.preview[0].map((header, i) => (
                                 <TableHead key={i} className="h-8 text-[10px] font-bold text-black uppercase whitespace-nowrap px-2">{header}</TableHead>
                               ))}
                             </TableRow>
                           </TableHeader>
                           <TableBody>
                             {file.preview.slice(1, 3).map((row, i) => (
                               <TableRow key={i} className="hover:bg-transparent border-neutral-100">
                                 {row.map((cell, j) => (
                                   <TableCell key={j} className="py-1 text-[11px] text-neutral-600 whitespace-nowrap px-2">{cell}</TableCell>
                                 ))}
                               </TableRow>
                             ))}
                           </TableBody>
                         </Table>
                       </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User Directive Cards */}
        <div className="pt-6 border-t border-neutral-100">
           <h4 className="text-sm font-bold text-black mb-4">Upload Instructions</h4>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100 hover:border-neutral-200 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-3">
                     <MousePointer2 className="h-4 w-4 text-black" />
                  </div>
                  <h5 className="font-semibold text-black text-sm mb-1">1. Select Type</h5>
                  <p className="text-xs text-neutral-500 leading-relaxed">Choose the target data table from the dropdown menu.</p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100 hover:border-neutral-200 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-3">
                     <FileText className="h-4 w-4 text-black" />
                  </div>
                  <h5 className="font-semibold text-black text-sm mb-1">2. Prepare CSV</h5>
                  <p className="text-xs text-neutral-500 leading-relaxed">Ensure your file is a valid .csv with matching headers.</p>
              </div>
              <div className="bg-neutral-50 rounded-lg p-4 border border-neutral-100 hover:border-neutral-200 transition-colors">
                  <div className="h-8 w-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center mb-3">
                     <CloudUpload className="h-4 w-4 text-black" />
                  </div>
                  <h5 className="font-semibold text-black text-sm mb-1">3. Upload</h5>
                  <p className="text-xs text-neutral-500 leading-relaxed">Drag your file above and click Upload to sync.</p>
              </div>
           </div>
        </div>

      </CardContent>
    </Card>
  )
}