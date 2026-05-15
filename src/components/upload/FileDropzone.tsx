import { CAlert, CBadge, CButton, CSpinner } from "@coreui/react";
import { AlertCircle, FileText, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

type FileDropzoneProps = {
  accept: string;
  onFileSelected: (file: File) => void;
  errorMessage?: string;
  helperText: string;
  isProcessing: boolean;
  onClearFile?: () => void;
  selectedFileName?: string;
  selectedFileSizeKb?: string;
};

export default function FileDropzone({
  accept,
  onFileSelected,
  errorMessage,
  helperText,
  isProcessing,
  onClearFile,
  selectedFileName,
  selectedFileSizeKb,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <>
      <div
        className={`csv-dropzone ${isDragging ? "csv-dropzone-active" : ""}`}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);

          const file = event.dataTransfer.files.item(0);
          if (file) {
            onFileSelected(file);
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="visually-hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onFileSelected(file);
            }
            event.currentTarget.value = "";
          }}
        />

        <div className="csv-upload-icon">
          <Upload size={28} aria-hidden="true" />
        </div>
        <div className="d-flex align-items-center gap-2 mb-2">
          <h2 className="h5 mb-0">Drop your file here</h2>
          <CBadge color="success">.CSV only</CBadge>
        </div>
        <p className="text-body-secondary mb-3">{helperText}</p>
        <CButton color="success" type="button" disabled={isProcessing}>
          Select CSV file
        </CButton>
      </div>

      {selectedFileName && (
        <div className="csv-selected-file justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <FileText size={20} aria-hidden="true" />
            <div>
              <div className="fw-semibold">{selectedFileName}</div>
              {selectedFileSizeKb && (
                <div className="text-body-secondary small">{selectedFileSizeKb} KB</div>
              )}
            </div>
          </div>
          {onClearFile && (
            <CButton
              color="secondary"
              variant="ghost"
              size="sm"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onClearFile();
              }}
              disabled={isProcessing}
            >
              <X size={16} aria-hidden="true" />
              <span className="ms-1">Clear</span>
            </CButton>
          )}
        </div>
      )}

      {isProcessing && (
        <CAlert color="info" className="d-flex align-items-center gap-2 mt-4 mb-0">
          <CSpinner size="sm" />
          Processing and validating CSV rows...
        </CAlert>
      )}

      {errorMessage && (
        <CAlert color="danger" className="d-flex align-items-center gap-2 mt-4 mb-0">
          <AlertCircle size={20} aria-hidden="true" />
          {errorMessage}
        </CAlert>
      )}
    </>
  );
}
