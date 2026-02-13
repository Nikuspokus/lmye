import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './cart.html',
    styleUrls: ['./cart.scss']
})
export class CartComponent implements OnInit {
    cartItems: CartItem[] = [];
    total: number = 0;

    private cartService = inject(CartService);

    ngOnInit() {
        this.loadCart();
    }

    loadCart() {
        this.cartItems = this.cartService.getItems();
        this.calculateTotal();
    }

    calculateTotal() {
        this.total = this.cartItems.reduce((acc, item) => {
            const price = parseFloat(item.product.price.replace('€', '').trim());
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

    checkout() {
        // Redirect to Messenger for order
        const message = `Bonjour, je souhaite commander : \n` +
            this.cartItems.map(i => `- ${i.quantity}x ${i.product.type} (${i.product.price})`).join('\n') +
            `\n\nTotal: ${this.total}€`;

        // Encode for URL? simplified for now
        window.open('https://m.me/61560562014105', '_blank');
    }
}
