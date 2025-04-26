import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GradientService {
  generateGradientCSS(
    type: 'linear' | 'radial',
    angle: number,
    colors: string[],
    stops: number[]
  ): string {
    if (type === 'linear') {
      return `linear-gradient(${angle}deg, ${this.formatColorsWithStops(colors, stops)})`;
    } else {
      return `radial-gradient(circle, ${this.formatColorsWithStops(colors, stops)})`;
    }
  }

  private formatColorsWithStops(colors: string[], stops: number[]): string {
    return colors.map((color, i) => `${color} ${stops[i]}%`).join(', ');
  }
}