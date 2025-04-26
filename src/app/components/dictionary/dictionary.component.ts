import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: {
    text?: string;
    audio?: string;
  }[];
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
      synonyms: string[];
      antonyms: string[];
    }[];
    synonyms: string[];
    antonyms: string[];
  }[];
  sourceUrls: string[];
}

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.component.html',
  styleUrls: ['./dictionary.component.scss'], 
  imports:[
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatIconModule,
    MatSnackBarModule, 
    CommonModule,
    MatChipsModule
  ]
})
export class DictionaryComponent {
  searchTerm = '';
  dictionaryData: DictionaryEntry[] = [];
  isLoading = false;
  errorMessage = '';
  recentSearches: string[] = [];

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  searchWord() {
    if (!this.searchTerm.trim()) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.dictionaryData = [];

    this.http.get<DictionaryEntry[]>(`https://api.dictionaryapi.dev/api/v2/entries/en/${this.searchTerm}`)
      .subscribe({
        next: (data) => {
          this.dictionaryData = data;
          this.addToRecentSearches(this.searchTerm);
          this.isLoading = false;
        },
        error: (error) => {
          this.errorMessage = error.status === 404 
            ? 'Word not found in dictionary' 
            : 'An error occurred while fetching data';
          this.isLoading = false;
          this.snackBar.open(this.errorMessage, 'Close', { duration: 3000 });
        }
      });
  }

  playAudio(audioUrl: string) {
    if (audioUrl) {
      new Audio(audioUrl).play();
    }
  }

  addToRecentSearches(word: string) {
    if (!this.recentSearches.includes(word.toLowerCase())) {
      this.recentSearches.unshift(word);
      if (this.recentSearches.length > 5) {
        this.recentSearches.pop();
      }
    }
  }

  searchRecent(word: string) {
    this.searchTerm = word;
    this.searchWord();
  }
}