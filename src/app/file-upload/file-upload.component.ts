import { Component } from "@angular/core";
import { HttpClient, HttpEventType, HttpResponse } from "@angular/common/http";
import { ImageUploadService } from "./image-upload.service";

interface IFileInput {
  readonly imageInput: HTMLInputElement;
  files: Array<File>;
}

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"],
})
export class FileUploadComponent {
  selectedFile: boolean = false;
  isDisabled: boolean = true;
  fileExists: boolean = false;
  fileUploaded: boolean = false;
  isLoading: boolean = false;
  uploadError: boolean = false;
  fileName: string = "";
  base64File: string[] = [];
  percentDone: number;

  constructor(
    private readonly imageUploadService: ImageUploadService,
    private readonly http: HttpClient
  ) {}

  processFile(imageInput: IFileInput): void {
    console.log("Processing file input");
    try {
      const file: File = imageInput.files[0];
      const reader = new FileReader();
      this.fileName = file.name;

      reader.readAsDataURL(file);
      reader.onload = (): void => {
        if (typeof reader.result === "string") {
          this.selectedFile = true;
          this.isDisabled = false;
          this.isLoading = true;
          this.base64File = reader.result.split(",");
        }
        const fileExtension = file.name.split(".").pop();

        const url = `https://torchcodelab.free.beeceptor.com`;

        this.imageUploadService
          .uploadFile(this.base64File[1], fileExtension)
          .subscribe(
            (res: { status: string; percent?: number; message?: string }) => {
              console.log("upload file status ", res.status, res.percent);
              if (res.status === "progress") {
                this.isLoading = true;
                this.percentDone = res.percent;
              }
              if (res.status === undefined || res.status === "pre_process") {
                this.fileUploaded = true;
                this.isLoading = false;
                this.uploadError = false;
              }
              return status;
            },
            (error: Error) => {
              this.isDisabled = false;
              this.isLoading = false;
              this.uploadError = true;
              return error;
            }
          );

        // this.http
        //   .post(
        //     url,
        //     {
        //       DocumentType: "paystub",
        //       Pages: [{ Data: this.base64File[1], Extension: fileExtension }],
        //     },
        //     {
        //       reportProgress: true,
        //       observe: "events",
        //     }
        //   )
        //   .subscribe((event) => {
        //     if (event.type === HttpEventType.UploadProgress) {
        //       this.percentDone = Math.round((100 * event.loaded) / event.total);
        //     } else if (event instanceof HttpResponse) {
        //       this.fileUploaded = true;
        //       console.log("event is an instance of a response", event.status);
        //     }
        //   });
      };
    } catch (error) {
      this.uploadError = true;
    }
  }
}
