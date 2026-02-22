import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cgv',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cgv.html',
  styleUrls: ['./cgv.scss']
})
export class CgvComponent {
  environment = environment;
}
