import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { FileUploadComponent } from "./file-upload/file-upload.component";

import { ImageUploadService } from "./file-upload/image-upload.service";

@NgModule({
  declarations: [AppComponent, FileUploadComponent],
  imports: [HttpModule, HttpClientModule, BrowserModule],
  providers: [ImageUploadService],
  bootstrap: [AppComponent]
})
export class AppModule {}
