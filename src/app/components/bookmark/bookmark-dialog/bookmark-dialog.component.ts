import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Bookmark } from '../../../services/bookmark.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-bookmark-dialog',
  imports:[
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule
    
  ],
  templateUrl: './bookmark-dialog.component.html',
  styleUrls: ['./bookmark-dialog.component.scss']
})
export class BookmarkDialogComponent {
  form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required, Validators.pattern('https?://.+')]),
    category: new FormControl(''),
    tags: new FormControl('')
  });

  isEditMode = false;

  constructor(
    private dialogRef: MatDialogRef<BookmarkDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bookmark?: Bookmark }
  ) {
    if (data?.bookmark) {
      this.isEditMode = true;
      this.form.patchValue({
        title: data.bookmark.title,
        url: data.bookmark.url,
        category: data.bookmark.category || '',
        tags: data.bookmark.tags?.join(', ') || ''
      });
    }
  }

  save() {
    if (this.form.valid) {
      const value = this.form.value;
      const bookmarkData = {
        title: value.title!,
        url: value.url!,
        category: value.category || undefined,
        tags: value.tags ? value.tags.split(',').map(t => t.trim()) : undefined
      };
      this.dialogRef.close(bookmarkData);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}