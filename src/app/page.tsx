"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/src/components/layout/AppShell";
import PageHeader from "@/src/components/layout/PageHeader";
import CsvUploadCard from "@/src/components/upload/CsvUploadCard";
import type { CsvValidationResultDto } from "@/src/backend/dto/CsvValidationResultDto";
import type { SolarDashboardStorageDto } from "@/src/backend/dto/SolarDashboardDto";

type ApiErrorResponse = {
  error?: string;
};

const isCsvFile = (file: File) => file.name.toLowerCase().endsWith(".csv");
const dashboardStorageKey = "clenergize.dashboard.validatedRows";

export default function Home() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<CsvValidationResultDto | null>(null);

  const handleFileSelected = async (file: File) => {
    setErrorMessage("");
    setResult(null);

    if (!isCsvFile(file)) {
      setSelectedFile(null);
      setErrorMessage("Please upload a CSV file. Other file types are not supported.");
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/csv/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const body = (await response.json()) as ApiErrorResponse;
        throw new Error(body.error || "We could not validate this CSV file.");
      }

      setResult((await response.json()) as CsvValidationResultDto);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We could not validate this CSV file. Please try again.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setErrorMessage("");
    setResult(null);
  };

  const continueToDashboard = () => {
    if (!result || result.success.length === 0) {
      return;
    }

    const payload: SolarDashboardStorageDto = {
      approvedRows: result.success,
      failedRowsCount: result.failed.length,
      totalRowsCount: result.success.length + result.failed.length,
      uploadedFileName: selectedFile?.name,
    };

    sessionStorage.setItem(dashboardStorageKey, JSON.stringify(payload));
    router.push("/dashboard");
  };

  return (
    <AppShell>
      <div className="page-content">
        <PageHeader
          eyebrow="Clenergize assessment"
          title="Solar Production CSV Upload"
          description="Upload solar production data to validate records, identify rejected rows, and prepare clean data for dashboard analysis."
          badgeText="CSV validation"
        />

        <CsvUploadCard
          accept=".csv,text/csv"
          errorMessage={errorMessage}
          isProcessing={isProcessing}
          onContinueToDashboard={continueToDashboard}
          onFileSelected={handleFileSelected}
          onReset={resetUpload}
          result={result}
          selectedFileName={selectedFile?.name}
          selectedFileSizeKb={
            selectedFile ? (selectedFile.size / 1024).toFixed(1) : undefined
          }
        />
      </div>
    </AppShell>
  );
}
