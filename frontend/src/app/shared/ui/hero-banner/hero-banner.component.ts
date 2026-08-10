import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [MatButton,RouterLink, MatIconModule],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss'
})
export class HeroBannerComponent {

}
