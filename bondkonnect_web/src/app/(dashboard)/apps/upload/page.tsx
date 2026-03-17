"use client";

import PageContainer from "../../components/container/PageContainer";
import UploadCsv from "../../components/apps/upload/CsvUpload";

export default function UploadPage() {
  return (
    <PageContainer 
      title="Data Upload | BondKonnect" 
      description="Upload CSV data files to update market statistics, graphs, and OBI tables."
    >
      <div className="flex-1 p-8 pt-6 flex items-center justify-center min-h-[80vh]">
          <UploadCsv />
      </div>      
    </PageContainer>
  );
}