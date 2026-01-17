"use client"
import * as React from 'react'
import { Check, FileIcon, Upload, X } from 'lucide-react'
import Papa from 'papaparse'
import axios from 'axios'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from "@/hooks/use-toast"


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
  'Primary Market': ['Bond Issues', 'Issue Date', 'Maturity Date','Value Date', '1st Call Date', '2nd Call Date', 'Par Call 1 (%)', 'Par Call 2 (%)', 'Pricing Method', 'DTM / WAL', 'Day-Count', '1st coupon date', '2nd coupon date', 'Spot Rate (%)', 'Par Yield (%)']
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
      console.log('Data to upload:', datatoUplaod)

      // Send data to API
      const response = await axios.post('http://localhost:8000/api/v1/auth/upload-data', {
        table: tableMapping[documentType as keyof typeof tableMapping],
        data: mappedData
      })
      console.log('Upload response:', response.data)

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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-6 w-6" />
          CSV File Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Select value={documentType} onValueChange={(value) => setDocumentType(value as keyof typeof headers)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Document Type" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(headers).map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}`}
          onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDrop={handleDrop}
        >
          <label htmlFor="file-upload" className="hidden">Upload CSV File</label>
          <input
            id="file-upload"
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileSelect}
            multiple
          />
          <FileIcon className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
          <div className="text-lg font-medium">
            Drop your CSV files here
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            or{' '}
            <Button
              variant="link"
              className="px-1"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse
            </Button>
          </div>
          {uploading && <div className="mt-4 text-primary">Uploading...</div>}
        </div>

        {files.length > 0 && (
          <Button onClick={handleUploadData} className="mt-4">
            Upload Data
          </Button>
        )}

        {files.map((file, index) => (
          <div key={index} className="space-y-4">
            <div className="flex items-center gap-4">
              <FileIcon className="h-8 w-8 text-primary" />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{file.name}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-500 rounded-full"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {file.status === 'complete' ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      `${file.progress}%`
                    )}
                  </span>
                </div>
              </div>
            </div>

            {file.preview && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Preview of {file.name}</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {file.preview[0].map((header, i) => (
                          <TableHead key={i}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {file.preview.slice(1, 4).map((row, i) => (
                        <TableRow key={i}>
                          {row.map((cell, j) => (
                            <TableCell key={j}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}



