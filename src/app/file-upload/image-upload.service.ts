import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpEvent,
  HttpEventType,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

interface IUploadImageResponse {
  status: string;
}

interface IExistingFile {
  id: string;
  status: string;
}

interface IExistingFilesArray extends Array<IExistingFile> {}

@Injectable({
  providedIn: "root",
})
export class ImageUploadService {
  constructor(private readonly http: HttpClient) {}
  percentDone: number;
  uploadSuccess: boolean;

  private getEventMessage(event: HttpEvent<any>, fileUpload) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        return this.fileUploadProgress(event);
      case HttpEventType.Response:
        return this.apiResponse(event);
      default:
        return `File "${fileUpload.DocumentType}" surprising upload event: ${event.type}.`;
    }
  }

  private fileUploadProgress(event) {
    const percentDone = Math.round((100 * event.loaded) / event.total);
    return { status: "progress", percent: percentDone };
  }

  private apiResponse(event) {
    return event.body;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error("ERROR:", error.error.message);
    } else {
      console.error(
        `BACKEND ERROR CODE: ${error.status},` + `body was: ${error.error}`
      );
    }
    return throwError("ERROR:", error.error);
  }

  uploadFile(image: string, type?: string): Observable<any> {
    const fileUpload = {
      DocumentType: "paystub",
      Pages: [{ Data: image, Extension: type }],
    };

    console.log("uploading a file...", fileUpload);

    const url = `https://torchcodelab.free.beeceptor.com`;

    return this.http
      .post<IUploadImageResponse>(url, fileUpload, {
        reportProgress: true,
        observe: "events",
      })
      .pipe(
        map((event) => this.getEventMessage(event, fileUpload)),
        catchError(this.handleError)
      );
  }

  uploadImage(image: string, type?: string): Observable<string> {
    const docUpload = {
      DocumentType: "paystub",
      Pages: [{ Data: image, Extension: type }],
    };

    const url = `https://torchcodelab.free.beeceptor.com`;

    return this.http.post<IUploadImageResponse>(url, docUpload).pipe(
      map((res: { status: string }) => res.status),
      catchError((error: Error) => {
        return throwError(error);
      })
    );

    // this.http
    //   .post(url, docUpload, {
    //     reportProgress: true,
    //     observe: "events",
    //   })
    //   .subscribe((event) => {
    //     if (event.type === HttpEventType.UploadProgress) {
    //       this.percentDone = Math.round((100 * event.loaded) / event.total);
    //       return { status: "pre-process" };
    //     } else if (event instanceof HttpResponse) {
    //       this.uploadSuccess = true;
    //       console.log("event is an instance of a response", event.status);
    //       return event.status;
    //     }
    //   });
  }
}
