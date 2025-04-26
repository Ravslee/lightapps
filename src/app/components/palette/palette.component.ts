import { Component, OnInit } from '@angular/core';
import { ColorService } from '../../services/color.service';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-palette',
  imports: [ CommonModule, MatButtonModule, 
    MatSliderModule, MatIconModule, 
    FormsModule, MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    FormsModule,],
  templateUrl: './palette.component.html',
  styleUrls: ['./palette.component.scss'],
})
export class PaletteComponent implements OnInit {
  colors: string[] = [];
  hue = 0;
  saturation = 0;
  brightness = 0;

  constructor(private colorService: ColorService) {}

  ngOnInit() {
    this.generateNewPalette();
  }

  generateNewPalette() {
    this.colors = this.colorService.generateRandomPalette();
  }

  adjustPalette() {
    this.colors = this.colors.map(color => 
      this.colorService.adjustColor(color, this.hue, this.saturation, this.brightness)
    );
  }

  copyToClipboard(color: string) {
    navigator.clipboard.writeText(color);
  }
}