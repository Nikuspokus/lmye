import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './cart.html',
    styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {
    cartItems: CartItem[] = [];
    total: number = 0;
    orderSuccess: boolean = false;

    orderData = {
        name: '',
        email: '',
        phone: '',
        address: '',
        message: ''
    };

    private cartService = inject(CartService);
    private route = inject(ActivatedRoute);

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            if (params['success'] === 'true') {
                this.orderSuccess = true;
                this.cartService.clearCart();
                // Hide message after 5 seconds
                setTimeout(() => this.orderSuccess = false, 5000);
            }
            this.loadCart();
        });
    }

    loadCart() {
        this.cartItems = this.cartService.getItems();
        this.calculateTotal();
    }

    calculateTotal() {
        this.total = this.cartItems.reduce((acc, item) => {
            const priceStr = item.product.price || '0';
            const price = parseFloat(priceStr.replace('€', '').trim()) || 0;
            return acc + (price * item.quantity);
        }, 0);
    }

    incrementQuantity(item: CartItem) {
        if (item.product.id) {
            this.cartService.updateQuantity(item.product.id, 1);
            this.loadCart();
        }
    }

    decrementQuantity(item: CartItem) {
        if (item.product.id && item.quantity > 1) {
            this.cartService.updateQuantity(item.product.id, -1);
            this.loadCart();
        }
    }

    removeItem(item: CartItem) {
        if (item.product.id) {
            this.cartService.removeItem(item.product.id);
            this.loadCart();
        }
    }

    clearCart() {
        this.cartService.clearCart();
        this.loadCart();
    }

    getCartSummaryForEmail(): string {
        const itemsList = this.cartItems.map(i =>
            `- ${i.quantity}x ${i.product.type} (${i.product.price})`
        ).join('\n');

        return `Détails de la commande :\n${itemsList}\n\nTotal : ${this.total}€`;
    }

    checkout() {
        // This is now handled by the form action in HTML
        console.log('Checkout triggered with data:', this.orderData);
        console.log('Cart summary:', this.getCartSummaryForEmail());
    }

    getCartSuccessUrl(): string {
        return window.location.origin + window.location.pathname + '?success=true';
    }
}
