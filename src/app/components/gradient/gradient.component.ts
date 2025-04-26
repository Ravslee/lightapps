import { Component } from '@angular/core';
import tinycolor from 'tinycolor2';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import html2canvas from 'html2canvas';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatChipListbox, MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-gradient',
  templateUrl: './gradient.component.html',
  styleUrls: ['./gradient.component.scss'],
imports:[
    MatCardModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatSliderModule,
    FormsModule,
    MatChipsModule,
    CommonModule, 
    MatFormFieldModule,
    MatInputModule,
    MatIcon
  ]
})
export class GradientComponent {
  // Gradient Configuration
  gradientType: 'linear' | 'radial' = 'linear';
  angle = 90;
  colors = [
    { value: '#3F51B5', position: 0 },  // Material Indigo
    { value: '#FF4081', position: 50 }, // Material Pink
    { value: '#4CAF50', position: 100 } // Material Green
  ];
  gradientStyle = '';
  cssCode = '';
  downloadUrl: SafeUrl | null = null;

  // Presets
  presets = [
    { name: 'Sunset', colors: ['#FF512F', '#DD2476'] },
    { name: 'Ocean', colors: ['#0093E9', '#80D0C7'] },
    { name: 'Forest', colors: ['#11998E', '#38EF7D'] }
  ];

  constructor(private sanitizer: DomSanitizer) {
    this.generateGradient();
  }

  // Generate CSS Gradient
  generateGradient() {
    const sortedColors = [...this.colors].sort((a, b) => a.position - b.position);
    const colorStops = sortedColors.map(c => `${c.value} ${c.position}%`).join(', ');

    if (this.gradientType === 'linear') {
      this.gradientStyle = `linear-gradient(${this.angle}deg, ${colorStops})`;
    } else {
      this.gradientStyle = `radial-gradient(circle, ${colorStops})`;
    }

    this.cssCode = `background: ${this.gradientStyle};`;
  }

  // Add/Remove Color Stops
  addColorStop() {
    this.colors.push({ 
      value: tinycolor.random().toHexString(), 
      position: 100 
    });
    this.generateGradient();
  }

  removeColorStop(index: number) {
    if (this.colors.length > 2) {
      this.colors.splice(index, 1);
      this.generateGradient();
    }
  }

  // Apply Preset
  applyPreset(preset: { colors: string[] }) {
    this.colors = preset.colors.map((color, i) => ({
      value: color,
      position: (i / (preset.colors.length - 1)) * 100
    }));
    this.generateGradient();
  }

  // Export as PNG
  async exportAsPNG() {
    const previewElement = document.querySelector('.preview-container') as HTMLElement;
    const canvas = await html2canvas(previewElement);
    this.downloadUrl = this.sanitizer.bypassSecurityTrustUrl(
      canvas.toDataURL('image/png')
    );
  }

  // Copy CSS to Clipboard
  copyToClipboard() {
    navigator.clipboard.writeText(this.cssCode);
  }
}