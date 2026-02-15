import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, Category, ProductService } from '../../services/product.service';

@Component({
    selector: 'app-nouveautes',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './nouveautes.html',
    styleUrls: ['./nouveautes.scss']
})
export class NouveautesComponent implements OnInit {
    latestProducts$: Observable<Product[]> = of([]);
    categories$: Observable<Category[]> = of([]);

    constructor(public productService: ProductService) { }

    ngOnInit(): void {
        this.latestProducts$ = this.productService.getProducts().pipe(
            map(products => products.filter(p => p.active !== false && p.isNew === true).slice(0, 4))
        );
        this.categories$ = this.productService.getCategories();
    }

    getCategoryColor(categoryName: string, categories: Category[]): string {
        const cat = categories.find(c => c.name === categoryName);
        return cat ? cat.color : '#f0f0f0';
    }
}
