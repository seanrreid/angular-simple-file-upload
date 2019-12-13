import { Component } from "@angular/core";
import { ImageUploadService } from "./image-upload.service";

class FileSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"]
})
export class FileUploadComponent {
  selectedFile: FileSnippet;
  fileName: string;

  constructor(private imageService: ImageUploadService) {}

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    this.fileName = file.name;

    reader.addEventListener("load", (event: any) => {
      this.selectedFile = new FileSnippet(event.target.result, file);
    });

    reader.readAsDataURL(file);
  }
}
