import { Injectable } from '@angular/core';
import tinycolor from 'tinycolor2';


@Injectable({ providedIn: 'root' })
export class ColorService {
  generateRandomPalette(count: number = 5): string[] {
    return Array.from({ length: count }, () => tinycolor.random().toHexString());
  }

  adjustColor(color: string, hue: number, saturation: number, brightness: number): string {
    return tinycolor(color)
      .spin(hue)
      .saturate(saturation)
      .lighten(brightness)
      .toHexString();
  }

  getColorFormats(color: string) {
    const tc = tinycolor(color);
    return {
      hex: tc.toHexString(),
      rgb: tc.toRgbString(),
      hsl: tc.toHslString(),
    };
  }
}