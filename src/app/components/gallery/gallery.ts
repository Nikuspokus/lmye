import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.scss']
})
export class GalleryComponent implements OnInit {
  products$: Observable<Product[]> = of([]);
  filteredProducts$: Observable<Product[]> = of([]);
  currentFilter: string = 'Tous';

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.products$ = this.productService.getProducts().pipe(
      map(products => products.filter(p => p.active !== false)) // Default to show if active field is missing (retro-compatibility)
    );
    this.filteredProducts$ = this.products$;
  }

  filterProducts(category: string) {
    this.currentFilter = category;
    if (category === 'Tous') {
      this.filteredProducts$ = this.products$;
    } else {
      // Re-assign filteredProducts$ to always derive from the latest products$
      this.filteredProducts$ = this.products$.pipe(
        map(products => products.filter(p => p.category === category))
      );
    }
  }
}
