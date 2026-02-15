import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, Category, ProductService } from '../../services/product.service';

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
  categories$: Observable<Category[]> = of([]);
  currentFilter: string = 'Tous';

  constructor(public productService: ProductService) { }

  ngOnInit(): void {
    this.products$ = this.productService.getProducts().pipe(
      map(products => products.filter(p => p.active !== false && p.isNew !== true))
    );
    this.filteredProducts$ = this.products$;

    this.categories$ = combineLatest([
      this.productService.getCategories(),
      this.products$
    ]).pipe(
      map(([categories, products]) => {
        return categories.filter(cat =>
          products.some(p => p.category === cat.name)
        );
      })
    );
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

  getCategoryColor(categoryName: string, categories: Category[]): string {
    const cat = categories.find(c => c.name === categoryName);
    return cat ? cat.color : '#f0f0f0';
  }
}
