import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const appRoutes: Routes = [
    {path: '', redirectTo: 'home', pathMatch: 'full'
    },{
        path: 'home',
        component: HomeComponent,
    },
  {
    path: 'palette',
    loadComponent: () =>
      import('./components/palette/palette.component').then(
        (m) => m.PaletteComponent
      ),
  },
  {
    path: 'gradient',
    loadComponent: () =>
      import('./components/gradient/gradient.component').then(
        (m) => m.GradientComponent
      ),
  },
  {
    path: 'box-shadow',
    loadComponent: () =>
      import(
        './components/box-shadow-generator/box-shadow-generator.component'
      ).then((m) => m.BoxShadowGeneratorComponent),
  },
  {
    path: 'base64-converter',
    loadComponent: () =>
      import('./components/image-to-base64/image-to-base64.component').then(
        (m) => m.ImageToBase64Component
      ),
  },
  {
    path: 'dictionary',
    loadComponent: () =>
      import('./components/dictionary/dictionary.component').then(
        (m) => m.DictionaryComponent
      ),
  },
  {
    path: 'bookmark-manager',
    loadComponent: () =>
      import(
        './components/bookmark/bookmark-manager/bookmark-manager.component'
      ).then((m) => m.BookmarkManagerComponent),
  },
  {
    path: 'drawing-board',
    loadComponent: () =>
      import('./components/drawing-board/drawing-board.component').then(
        (m) => m.DrawingBoardComponent
      ),
  },
];
