import { Injectable } from "@angular/core";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

interface IUploadImageResponse {
  status: string;
  code: number;
}

@Injectable()
export class ImageUploadService {
  constructor(private http: HttpClient) {}

  public uploadImage(
    image: string,
    type?: string
  ): Observable<string | { status: string; code: number }> {
    const docUpload = {
      DocumentType: "paystub",
      Pages: [{ Data: image, Extension: type }]
    };

    const url = `http://localhost:3000`;

    return this.http
      .post<IUploadImageResponse>(url, docUpload, {
        reportProgress: true,
        observe: "events"
      })
      .pipe(
        map(event => {
          switch (event.type) {
            case HttpEventType.UploadProgress:
              const progress = Math.round((100 * event.loaded) / event.total);
              return { status: "progress", code: progress };
            case HttpEventType.ResponseHeader:
              return { status: event.statusText, code: event.status };
            case HttpEventType.Response:
              return event.body;
            case HttpEventType.DownloadProgress:
              return { status: "download progress", code: event.loaded };
            default:
              return { status: "default status", code: null };
          }
        })
      );
  }
}

//(res: { status: string }) => res.status

/*
  .pipe(
        map((res: { status: string }) => res.status),
        catchError((error: Error) => {
          return throwError(error);
        })
      );
*/
