import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product, ProductService } from '../../services/product.service';

@Component({
    selector: 'app-nouveautes',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './nouveautes.html',
    styleUrls: ['./nouveautes.scss']
})
export class NouveautesComponent implements OnInit {
    latestProducts$: Observable<Product[]> = of([]);

    constructor(private productService: ProductService) { }

    ngOnInit(): void {
        this.latestProducts$ = this.productService.getProducts().pipe(
            map(products => products.filter(p => p.active !== false && p.isNew === true).slice(0, 4))
        );
    }
}
