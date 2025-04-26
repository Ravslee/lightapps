import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  category?: string;
  tags?: string[];
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private bookmarks: Bookmark[] = [];
  private readonly STORAGE_KEY = 'bookmark-manager-data';

  constructor(private snackBar: MatSnackBar) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.bookmarks));
  }

  private loadFromLocalStorage() {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      this.bookmarks = JSON.parse(data);
      // Convert string dates back to Date objects
      this.bookmarks.forEach(b => b.createdAt = new Date(b.createdAt));
    }
  }

  getAllBookmarks(): Bookmark[] {
    return [...this.bookmarks];
  }

  getBookmarksByCategory(category: string): Bookmark[] {
    return this.bookmarks.filter(b => b.category === category);
  }

  getCategories(): string[] {
    return [...new Set(this.bookmarks.map(b => b.category || 'Uncategorized'))];
  }

  addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): void {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: this.generateId(),
      createdAt: new Date()
    };
    this.bookmarks.unshift(newBookmark);
    this.saveToLocalStorage();
    this.snackBar.open('Bookmark added!', 'Close', { duration: 2000 });
  }

  updateBookmark(id: string, updates: Partial<Bookmark>): void {
    const index = this.bookmarks.findIndex(b => b.id === id);
    if (index !== -1) {
      this.bookmarks[index] = { ...this.bookmarks[index], ...updates };
      this.saveToLocalStorage();
      this.snackBar.open('Bookmark updated!', 'Close', { duration: 2000 });
    }
  }

  deleteBookmark(id: string): void {
    this.bookmarks = this.bookmarks.filter(b => b.id !== id);
    this.saveToLocalStorage();
    this.snackBar.open('Bookmark deleted!', 'Close', { duration: 2000 });
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}