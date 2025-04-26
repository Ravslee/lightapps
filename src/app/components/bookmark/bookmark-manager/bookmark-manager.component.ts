import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BookmarkDialogComponent } from '../bookmark-dialog/bookmark-dialog.component';
import { Bookmark, BookmarkService } from '../../../services/bookmark.service';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-bookmark-manager',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatSnackBarModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './bookmark-manager.component.html',
  styleUrl: './bookmark-manager.component.scss',
})
export class BookmarkManagerComponent implements OnInit {
  bookmarks: Bookmark[] = [];
  categories: string[] = [];
  selectedCategory: string | null = null;
  searchQuery = '';

  constructor(
    private bookmarkService: BookmarkService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadBookmarks();
  }

  loadBookmarks() {
    this.bookmarks = this.bookmarkService.getAllBookmarks();
    this.categories = this.bookmarkService.getCategories();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(BookmarkDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.bookmarkService.addBookmark(result);
        this.loadBookmarks();
      }
    });
  }

  openEditDialog(bookmark: Bookmark) {
    const dialogRef = this.dialog.open(BookmarkDialogComponent, {
      width: '500px',
      data: { bookmark },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.bookmarkService.updateBookmark(bookmark.id, result);
        this.loadBookmarks();
      }
    });
  }

  deleteBookmark(id: string) {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      this.bookmarkService.deleteBookmark(id);
      this.loadBookmarks();
    }
  }

  filterByCategory(category: string | null) {
    this.selectedCategory = category;
    if (category) {
      this.bookmarks = this.bookmarkService.getBookmarksByCategory(category);
    } else {
      this.bookmarks = this.bookmarkService.getAllBookmarks();
    }
  }

  searchBookmarks() {
    const query = this.searchQuery.toLowerCase();
    let allBookmarks = this.bookmarkService.getAllBookmarks();

    if (this.selectedCategory) {
      allBookmarks = this.bookmarkService.getBookmarksByCategory(
        this.selectedCategory
      );
    }

    this.bookmarks = allBookmarks.filter(
      (b) =>
        b.title.toLowerCase().includes(query) ||
        b.url.toLowerCase().includes(query) ||
        (b.tags && b.tags.some((tag) => tag.toLowerCase().includes(query)))
    );
  }

  clearSearch() {
    this.searchQuery = '';
    this.filterByCategory(this.selectedCategory);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}
