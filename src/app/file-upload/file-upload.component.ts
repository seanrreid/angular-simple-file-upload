import { Component, ViewChild, ElementRef } from "@angular/core";
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
    @ViewChild('canvas', { static: false }) canvas: any;
    canvasEl: any;
    ctx: CanvasRenderingContext2D;
    selectedFile: boolean = false;
    isDisabled: boolean = true;
    fileExists: boolean = false;
    fileUploaded: boolean = false;
    isLoading: boolean = false;
    uploadError: boolean = false;
    imgSrc: string = ""
    fileName: string = "";
    base64File: string[] = [];
    percentDone: number;

    constructor(
        private readonly imageUploadService: ImageUploadService,
        private readonly http: HttpClient
    ) { }


    ngAfterViewInit() {
        this.canvasEl = this.canvas.nativeElement;
        this.ctx = this.canvasEl.getContext('2d');
        console.log("ng view init", this.canvas);
    }

    renderImage(): void {
        const _this = this;
        this.canvasEl = this.canvas.nativeElement;
        this.ctx = this.canvasEl.getContext('2d');
        const img = new Image();
        img.onload = function () {
            _this.canvasEl.width = img.width;
            _this.canvasEl.height = img.height;
            _this.ctx.drawImage(img, 0, 0);
        }
        img.src = this.imgSrc;
    }

    rotateImage(): void {
        const _this = this;
        console.log("rotating image??", this.imgSrc);
        this.canvasEl = this.canvas.nativeElement;
        this.ctx = this.canvasEl.getContext('2d');
        const img = new Image();
        img.onload = function () {
            _this.canvasEl.width = img.height;
            _this.canvasEl.height = img.width;
            _this.ctx.rotate(90 * Math.PI / 180);
            _this.ctx.drawImage(img, 0, 0);
        }
        img.src = this.imgSrc;
    }

    processFile(imageInput: IFileInput): void {
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
                    this.imgSrc = reader.result;
                    this.renderImage();
                }
                const fileExtension = file.name.split(".").pop();




                //const url = `https://torchcodelab.free.beeceptor.com`;

                // this.imageUploadService
                //   .uploadFile(this.base64File[1], fileExtension)
                //   .subscribe(
                //     (res: { status: string; percent?: number; message?: string }) => {
                //       console.log("upload file status ", res.status, res.percent);
                //       if (res.status === "progress") {
                //         this.isLoading = true;
                //         this.percentDone = res.percent;
                //       }
                //       if (res.status === undefined || res.status === "pre_process") {
                //         this.fileUploaded = true;
                //         this.isLoading = false;
                //         this.uploadError = false;
                //       }
                //       return status;
                //     },
                //     (error: Error) => {
                //       this.isDisabled = false;
                //       this.isLoading = false;
                //       this.uploadError = true;
                //       return error;
                //     }
                //   );
            };
        } catch (error) {
            this.uploadError = true;
        }
    }
}
