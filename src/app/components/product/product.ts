import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Product, Category, ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product.html',
  styleUrls: ['./product.scss']
})
export class ProductComponent implements OnInit {
  product$: Observable<Product | undefined> = of(undefined);
  suggestions$: Observable<Product[]> = of([]);
  categories$: Observable<Category[]> = of([]);
  quantity = 1;
  selectedImage: string | null = null; // Added property
  currentProduct: Product | undefined; // To hold resolved product for cart

  private cartService = inject(CartService);

  private route = inject(ActivatedRoute);
  public productService = inject(ProductService);
  private router = inject(Router);



  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id'); // ID is now string
      if (id) {
        this.product$ = this.productService.getProductById(id);
        this.suggestions$ = this.productService.getSuggestions(id);
        // Reset gallery selection when product changes
        this.selectedImage = null; // Added reset logic

        // Subscribe to get the actual product object for cart usage
        this.product$.subscribe(p => {
          this.currentProduct = p;
          if (p && p.id) {
            this.quantity = this.cartService.getItemQuantity(p.id);
            window.scrollTo(0, 0);
          }
        });
      }
    });

    this.categories$ = this.productService.getCategories();
  }

  contactStore() {
    window.open('https://m.me/61560562014105', '_blank');
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (this.currentProduct && this.quantity > 0) {
      this.cartService.setItemQuantity(this.currentProduct, this.quantity);
      alert('Panier mis à jour !');
    }
  }

  selectImage(url: string) {
    this.selectedImage = url;
  }

  getCategoryColor(categoryName: string, categories: Category[]): string {
    const cat = categories.find(c => c.name === categoryName);
    return cat ? cat.color : '#f0f0f0';
  }
}
