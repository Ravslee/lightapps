import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-box-shadow-generator',
  templateUrl: './box-shadow-generator.component.html',
  styleUrls: ['./box-shadow-generator.component.scss'],
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    CommonModule,
    MatChipsModule,
    MatIconModule,
    MatSliderModule, 
    ReactiveFormsModule,
    MatInput
  ]
})
export class BoxShadowGeneratorComponent {
  // Shadow properties
  horizontalOffset = 5;
  verticalOffset = 5;
  blurRadius = 10;
  spreadRadius = 0;
  shadowColor = '#000000';
  shadowOpacity = 0.5;
  inset = false;
  
  // Preview box styles
  boxWidth = 200;
  boxHeight = 200;
  boxColor = '#3f51b5';
  
  // Generated CSS
  cssCode = '';
  previewStyle = {};
  
  constructor(private sanitizer: DomSanitizer) {
    this.updateShadow();
  }
  
  updateShadow() {
    const rgbaColor = this.hexToRgba(this.shadowColor, this.shadowOpacity);
    
    this.cssCode = `box-shadow: ${this.inset ? 'inset ' : ''}${this.horizontalOffset}px ${this.verticalOffset}px ${this.blurRadius}px ${this.spreadRadius}px ${rgbaColor};`;
    
    this.previewStyle = {
      width: `${this.boxWidth}px`,
      height: `${this.boxHeight}px`,
      backgroundColor: this.boxColor,
      boxShadow: `${this.inset ? 'inset ' : ''}${this.horizontalOffset}px ${this.verticalOffset}px ${this.blurRadius}px ${this.spreadRadius}px ${rgbaColor}`
    };
  }
  
  hexToRgba(hex: string, opacity: number): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  copyToClipboard() {
    navigator.clipboard.writeText(this.cssCode)
      .then(() => alert('CSS copied to clipboard!'))
      .catch(err => console.error('Failed to copy: ', err));
  }
  
  resetValues() {
    this.horizontalOffset = 5;
    this.verticalOffset = 5;
    this.blurRadius = 10;
    this.spreadRadius = 0;
    this.shadowColor = '#000000';
    this.shadowOpacity = 0.5;
    this.inset = false;
    this.updateShadow();
  }
}