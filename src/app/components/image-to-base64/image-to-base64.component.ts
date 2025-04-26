import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-image-to-base64',
  templateUrl: './image-to-base64.component.html',
  styleUrls: ['./image-to-base64.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
  MatIconModule]
})
export class ImageToBase64Component {
  base64String: string = '';
  imagePreview: SafeUrl | string = '';
  fileName: string = '';
  fileSize: string = '';
  isDragging = false;
  errorMessage: string = '';

  constructor(private sanitizer: DomSanitizer) {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.processFile(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    
    if (event.dataTransfer?.files) {
      const file = event.dataTransfer.files[0];
      this.processFile(file);
    }
  }

  processFile(file: File) {
    // Reset previous values
    this.errorMessage = '';
    this.base64String = '';
    this.imagePreview = '';
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      this.errorMessage = 'Please select an image file';
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage = 'File size exceeds 5MB limit';
      return;
    }

    this.fileName = file.name;
    this.fileSize = this.formatFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.base64String = e.target.result;
      this.imagePreview = this.sanitizer.bypassSecurityTrustUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  copyToClipboard() {
    if (!this.base64String) return;
    
    navigator.clipboard.writeText(this.base64String)
      .then(() => {
        // Show copied feedback
        const copyBtn = document.querySelector('.copy-btn');
        if (copyBtn) {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.textContent = 'Copy Base64';
          }, 2000);
        }
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }

  clearAll() {
    this.base64String = '';
    this.imagePreview = '';
    this.fileName = '';
    this.fileSize = '';
    this.errorMessage = '';
  }
}