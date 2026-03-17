"use client"
import React, { useState, useEffect } from 'react'

import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { getStatsTable } from '@/lib/actions/api.actions'


export type Bond = {
  BondIssueNo: string
  IssueDate: string
  Coupon: string
  DtmYrs: string
  DirtyPrice: string
  SpotYield: string
}

// const bonds: Bond[] = [
//   {
//     Bond: "FXD 1/2020/5Yr",
//     "Issue Date": "5/11/2020",
//     "Maturity Date": "5/5/2025",
//     "YTM/YTC": "YTM",
//     Coupon: "11.667",
//     Price: "39",
//     Yield: "4.1071",
//     Duration: "10.7896%",
//     Convexity: "107.4080",
//     "Annual Volatility": "-3.0813",
//     "Sharpe Ratio": "12.56",
//     "Tracking Error": "0.0331",
//     "Active Risk": "-6.46%",
//     "Active Return": "10.09%",
//     "Indicative Bid-Ask": "16.09% - 9.95%",
//     "Next coupon Days": "180",
//     "DTM (Yrs)": "4.0",
//     "last 91 days": "0",
//     "last 364 days": "90",
//   },
//   // Add more bonds here as needed
// ]

export function BondSelector({ onSelect }: { onSelect: (bonds: Bond[]) => void }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string[]>([])
  const [bonds, setBonds] = useState<Bond[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getStatsTable()
        if (!Array.isArray(result)) {
          console.error("Expected an array from getStatsTable, got:", result);
          setBonds([]);
          return;
        }
        const formattedData = (result ?? []).map((bond: Record<string, unknown>): Bond => {
          const issueDate = bond.IssueDate;
          let formattedDate = "";
          if (issueDate && (typeof issueDate === 'string' || typeof issueDate === 'number' || issueDate instanceof Date)) {
            try {
              formattedDate = new Date(issueDate).toLocaleDateString();
            } catch {
              formattedDate = "";
            }
          }
          
          return {
            BondIssueNo: String(bond.BondIssueNo || ''),
            IssueDate: formattedDate,
            Coupon: String(bond.Coupon || ''),
            DtmYrs: String(bond.DtmYrs || ''),
            DirtyPrice: String(bond.DirtyPrice || ''),
            SpotYield: String(bond.SpotYield || ''),
          };
        })

        setBonds(formattedData)
        console.log('Bonds data:', formattedData);
      } catch (error) {
        console.error('Error fetching bonds data:', error)
      }
    }
    fetchData()
  }, []);

  
  const handleSelect = (bond: Bond) => {
    setValue((prev) => {
      const newValue = prev.includes(bond.BondIssueNo)
        ? prev.filter((item) => item !== bond.BondIssueNo)
        : [...prev, bond.BondIssueNo];
      onSelect(bonds.filter(b => newValue.includes(b.BondIssueNo)));
      return newValue;
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value.length > 0
            ? `${value.length} bond(s) selected`
            : "Select bonds..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search bond..." />
          <CommandEmpty>No bond found.</CommandEmpty>
          <CommandGroup>
            {bonds.map((bond) => (
              <CommandItem
                key={bond.BondIssueNo}
                value={bond.BondIssueNo}
                onSelect={() => handleSelect(bond)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(bond.BondIssueNo) ? "opacity-100" : "opacity-0"
                  )}
                />
                {bond.BondIssueNo}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

