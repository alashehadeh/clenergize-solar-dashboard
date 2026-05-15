import { CsvUploadController } from "@/src/backend/controllers/CsvUploadController";

export async function POST(request: Request) {
  return CsvUploadController.handleUpload(request);
}
