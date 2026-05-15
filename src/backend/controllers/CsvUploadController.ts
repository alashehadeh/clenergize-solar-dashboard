import { CsvValidationService } from "../services/CsvValidationService";
import { parseCsvContent } from "../utils/csvParser";

const csvValidationService = new CsvValidationService();

export class CsvUploadController {
  static async handleUpload(request: Request) {
    try {
      const formData = await request.formData();
      const file = formData.get("file");

      if (!(file instanceof File)) {
        return Response.json({ error: "Please select a CSV file to upload." }, { status: 400 });
      }

      if (!file.name.toLowerCase().endsWith(".csv")) {
        return Response.json(
          { error: "Please upload a CSV file. Other file types are not supported." },
          { status: 400 },
        );
      }

      const rows = parseCsvContent(await file.text());
      const result = csvValidationService.validate(rows);

      return Response.json(result);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not process this CSV file. Please check the file and try again.";

      return Response.json({ error: message }, { status: 400 });
    }
  }
}
