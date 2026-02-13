import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./components/home/home').then(m => m.HomeComponent) },
    { path: 'product/:id', loadComponent: () => import('./components/product/product').then(m => m.ProductComponent) },
    { path: 'cart', loadComponent: () => import('./components/cart/cart').then(m => m.CartComponent) },
    { path: 'atelier', loadComponent: () => import('./components/about/about').then(m => m.AboutComponent) },
    { path: 'mentions-legales', loadComponent: () => import('./components/legal/legal').then(m => m.LegalComponent) },
    { path: 'login', loadComponent: () => import('./components/login/login').then(m => m.LoginComponent) },
    {
        path: 'admin-lmye',
        loadComponent: () => import('./components/admin/admin-dashboard').then(m => m.AdminDashboardComponent),
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: '' }
];
