import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
  imports: [MatSidenavModule, 
    MatFormFieldModule, MatSelectModule, 
    MatButtonModule, MatIcon, MatListModule,
     MatDividerModule, RouterOutlet, RouterLink, RouterLinkActive, RouterOutlet,
    MatToolbarModule, CommonModule],

})
export class SidenavComponent {
  activeApp = {
    name: '',
  }

}
