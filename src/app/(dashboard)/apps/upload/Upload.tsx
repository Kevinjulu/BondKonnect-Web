"use client";


import PageContainer from "../../components/container/PageContainer";
import UploadCsv from "../../components/apps/upload/CsvUpload";

export default function UploadPage() {
  
  return (

    <PageContainer title="Upload Page" description="this is Upload page">
        <div className=" space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Upload</h2>
            <div className="flex items-center space-x-2">

           

            </div>
          </div>
          <UploadCsv/>
        </div>      

    </PageContainer>
  );
}
