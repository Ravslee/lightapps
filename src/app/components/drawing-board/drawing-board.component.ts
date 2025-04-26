import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {  MatButtonModule } from '@angular/material/button';
import {  MatIconModule } from '@angular/material/icon';

type BrushType = 'pen' | 'marker' | 'pencil' | 'airbrush' | 'eraser';

@Component({
  selector: 'app-drawing-board',
  templateUrl: './drawing-board.component.html',
  styleUrls: ['./drawing-board.component.scss'],
  imports:[
    FormsModule,
    MatIconModule,
    CommonModule,
    MatButtonModule, 
    MatIconModule
  ]
})
export class DrawingBoardComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  private points: {x: number, y: number}[] = [];
  
  // Drawing settings
  strokeColor = '#000000';
  strokeWidth = 5;
  brushType: BrushType = 'pen';
  backgroundColor = '#ffffff';
  opacity = 1;
  smoothing = 0.5; // For smooth curves

  ngAfterViewInit() {
    this.setupCanvas();
    this.clearCanvas();
  }

  private setupCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.ctx.lineJoin = 'round';
    this.ctx.lineCap = 'round';
  }

  startDrawing(e: MouseEvent | TouchEvent) {
    this.isDrawing = true;
    const pos = this.getPosition(e);
    this.lastX = pos.x;
    this.lastY = pos.y;
    this.points = [{x: pos.x, y: pos.y}];
  }

  draw(e: MouseEvent | TouchEvent) {
    if (!this.isDrawing) return;
    
    const pos = this.getPosition(e);
    this.points.push({x: pos.x, y: pos.y});
    
    // Different brush behaviors
    switch(this.brushType) {
      case 'pen':
        this.drawPen(pos);
        break;
      case 'marker':
        this.drawMarker(pos);
        break;
      case 'pencil':
        this.drawPencil(pos);
        break;
      case 'airbrush':
        this.drawAirbrush(pos);
        break;
      case 'eraser':
        this.drawEraser(pos);
        break;
    }
    
    this.lastX = pos.x;
    this.lastY = pos.y;
  }

  private drawPen(pos: {x: number, y: number}) {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.globalAlpha = this.opacity;
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
  }

  private drawMarker(pos: {x: number, y: number}) {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.globalAlpha = 0.6; // Slightly transparent
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
  }

  private drawPencil(pos: {x: number, y: number}) {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = this.strokeWidth * 0.7; // Thinner than pen
    this.ctx.globalAlpha = 0.9;
    
    // Create pencil texture effect
    for (let i = 0; i < 3; i++) {
      const offset = (Math.random() - 0.5) * 2;
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX + offset, this.lastY + offset);
      this.ctx.lineTo(pos.x + offset, pos.y + offset);
      this.ctx.stroke();
    }
  }

  private drawAirbrush(pos: {x: number, y: number}) {
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.fillStyle = this.strokeColor;
    this.ctx.globalAlpha = 0.2;
    
    const density = this.strokeWidth * 2;
    for (let i = 0; i < density; i++) {
      const radius = this.strokeWidth * 2;
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const x = pos.x + Math.cos(angle) * distance;
      const y = pos.y + Math.sin(angle) * distance;
      const size = Math.random() * 3 + 1;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private drawEraser(pos: {x: number, y: number}) {
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.strokeStyle = 'rgba(0,0,0,1)';
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.globalAlpha = 1;
    
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
  }

  stopDrawing() {
    this.isDrawing = false;
    
    // Draw smooth curve if we have enough points
    if (this.points.length > 2 && this.smoothing > 0) {
      this.drawSmoothCurve();
    }
  }

  private drawSmoothCurve() {
    if (this.brushType === 'airbrush') return;
    
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.strokeStyle = this.strokeColor;
    this.ctx.lineWidth = this.strokeWidth;
    this.ctx.globalAlpha = this.opacity;
    
    // Simple smoothing algorithm
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    
    for (let i = 1; i < this.points.length - 2; i++) {
      const xc = (this.points[i].x + this.points[i + 1].x) / 2;
      const yc = (this.points[i].y + this.points[i + 1].y) / 2;
      this.ctx.quadraticCurveTo(this.points[i].x, this.points[i].y, xc, yc);
    }
    
    this.ctx.stroke();
  }

  // ... (keep existing getPosition, clearCanvas, downloadDrawing methods)

  changeBrushType(type: BrushType) {
    this.brushType = type;
  }

  // Add to existing changeColor method
  changeColor(color: string) {
    this.strokeColor = color;
    if (this.brushType === 'eraser') {
      this.brushType = 'pen';
    }
  }

  downloadDrawing() {
    const canvas = this.canvasRef.nativeElement;
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  clearCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  getPosition(e: MouseEvent | TouchEvent): {x: number, y: number} {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - rect.left;
    const y = (e instanceof MouseEvent ? e.clientY : e.touches[0].clientY) - rect.top;
    return { x, y };
  }


}