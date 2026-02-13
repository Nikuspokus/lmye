import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero';
import { ConceptComponent } from '../concept/concept';
import { GalleryComponent } from '../gallery/gallery';
import { SocialComponent } from '../social/social';
import { NouveautesComponent } from '../nouveautes/nouveautes';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    ConceptComponent,
    NouveautesComponent,
    GalleryComponent,
    SocialComponent
  ],
  template: `
    <app-hero></app-hero>
    <app-concept></app-concept>
    <app-nouveautes></app-nouveautes>
    <app-gallery></app-gallery>
    <app-social></app-social>
  `
})
export class HomeComponent { }
