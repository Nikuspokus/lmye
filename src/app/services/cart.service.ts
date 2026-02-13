import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from './product.service';

export interface CartItem {
    product: Product;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private items: CartItem[] = [];
    private cartCount = new BehaviorSubject<number>(0);
    cartCount$ = this.cartCount.asObservable();

    constructor() {
        this.loadCart();
    }

    addToCart(product: Product, quantity: number) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({ product, quantity });
        }
        this.updateCart();
    }

    getItems(): CartItem[] {
        return this.items;
    }

    getItemQuantity(productId: string): number {
        const item = this.items.find(i => i.product.id === productId);
        return item ? item.quantity : 1;
    }

    updateQuantity(productId: string, delta: number) {
        const item = this.items.find(i => i.product.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.updateCart();
            }
        }
    }

    setItemQuantity(product: Product, quantity: number) {
        const existingItem = this.items.find(item => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity = quantity;
        } else {
            this.items.push({ product, quantity });
        }
        this.updateCart();
    }

    removeItem(productId: string) {
        this.items = this.items.filter(item => item.product.id !== productId);
        this.updateCart();
    }

    clearCart() {
        this.items = [];
        this.updateCart();
    }

    private updateCart() {
        this.cartCount.next(this.items.reduce((acc, item) => acc + item.quantity, 0));
        this.saveCart();
    }

    private saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    private loadCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            this.items = JSON.parse(savedCart);
            this.cartCount.next(this.items.reduce((acc, item) => acc + item.quantity, 0));
        }
    }
}
