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
    fileType: string = ""
    base64File: string[] = [];
    percentDone: number = 0;

    constructor(
        private readonly imageUploadService: ImageUploadService,
        private readonly http: HttpClient
    ) { }


    ngAfterViewInit() {
        this.canvasEl = this.canvas.nativeElement;
        this.ctx = this.canvasEl.getContext('2d');
    }

    renderImage(): void {
        const _this = this;
        const image = new Image();
        image.src = this.imgSrc;
        image.onload = function () {
            _this.canvasEl.width = image.width;
            _this.canvasEl.height = image.height;
            _this.ctx.drawImage(image, 0, 0);
        }
    }

    rotateImage(): void {
        const image = new Image();
        image.src = this.imgSrc;

        image.onload = (): void => {
            // We're rotating the images, so height and width flop
            this.canvasEl.width = image.height;
            this.canvasEl.height = image.width;
            this.ctx.rotate(Math.PI / 2);
            this.ctx.translate(0, -this.canvasEl.width);
            this.ctx.drawImage(image, 0, 0);
            this.imgSrc = this.canvasEl.toDataURL(this.fileType, 100);
            this.base64File = this.imgSrc.split(",");
        }
    }

    generatePreview(imageInput: IFileInput): void {
        const file: File = imageInput.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);
        reader.onload = (): void => {
            if (typeof reader.result === "string") {
                this.selectedFile = true;
                this.isDisabled = false;
                this.imgSrc = reader.result;
                this.base64File = reader.result.split(",");
                this.fileName = file.name;
                this.fileType = file.type;
                this.renderImage();
            }
        }
    }

    uploadFile(): void {
        try {
            console.log("the file:", this.imgSrc);
            const fileExtension: string = this.fileName.split(".").pop();
            const file: string = this.base64File[1];

            this.imageUploadService
                .uploadFile(file, fileExtension)
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
        } catch (error) {
            this.uploadError = true;
        }
    }
}
