import { Component } from "@angular/core";
import { ImageUploadService } from "./image-upload.service";

interface IFileInput {
  readonly imageInput: HTMLInputElement;
  files: Array<File>;
}

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"]
})
export class FileUploadComponent {
  selectedFile: boolean = false;
  fileUploaded: boolean = false;
  fileExists: boolean = false;
  uploadError: boolean = false;
  fileName: string = "";
  base64File: string[] = [];
  progress: number = 0;

  constructor(private readonly imageUploadService: ImageUploadService) {}

  processFile(imageInput: IFileInput): void {
    try {
      const file: File = imageInput.files[0];
      const reader = new FileReader();
      this.fileName = file.name;

      reader.readAsDataURL(file);
      reader.onload = (): void => {
        if (typeof reader.result === "string") {
          this.selectedFile = true;
          this.base64File = reader.result.split(",");
        }
        const fileExtension = file.name.split(".").pop();
        this.imageUploadService
          .uploadImage(this.base64File[1], fileExtension)
          .subscribe(
            (res: { status: string; code: number }) => {
              console.log("res ", res);
              const { status, code } = res;
              if (status === "progress") {
                this.progress = code;
              }
              if (status === "OK" || status === "pre_process") {
                this.fileUploaded = true;
                this.uploadError = false;
              }
              return status;
            },
            (error: Error) => {
              this.uploadError = true;
              return error;
            }
          );
      };
    } catch (error) {
      this.uploadError = true;
    }
  }
}
