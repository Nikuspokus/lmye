import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social.html',
  styleUrls: ['./social.scss']
})
export class SocialComponent {
  environment = environment;
  posts = [
    {
      id: 1,
      name: 'La Marque y Est',
      date: 'Hier',
      text: '',
      image: 'assets/images/518823617_122176082222352067_1998949892650660751_n.jpg',
      likes: 0,
      comments: 0,
      reactionType: '❤️'
    },
    {
      id: 2,
      name: 'La Marque y Est',
      date: 'Il y a 2 jours',
      text: '',
      image: 'assets/images/518214241_122176082156352067_2159092796332586704_n.jpg',
      likes: 0,
      comments: 0,
      reactionType: '❤️'
    },
    {
      id: 3,
      name: 'La Marque y Est',
      date: 'Il y a 4 jours',
      text: '',
      image: 'assets/images/503705126_10230535106655575_470912678716942903_n.jpg',
      likes: 0,
      comments: 0,
      reactionType: '❤️'
    }
  ];
}
