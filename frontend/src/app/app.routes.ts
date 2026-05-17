import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        loadChildren: () => import('./pages/home/home.component').then(c => c.HomeComponent)
    },
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.component').then(c => c.LoginComponent)
    },
    {
        path: 'register',
        loadChildren: () => import('./pages/register/register.component').then(c => c.RegisterComponent)
    },
    {
        path: 'orders',
        loadChildren: () => import('./pages/orders/orders.component').then(c => c.OrdersComponent)
    },
    {
        path: 'cart',
        loadChildren: () => import('./pages/cart/cart.component').then(c => c.CartComponent)
    },
    {
        path: 'profile',
        loadChildren: () => import('./pages/profile/profile.component').then(c => c.ProfileComponent)
    },
    {
        path: '**',
        redirectTo: 'not-found',
        pathMatch: 'full'
    },
    {
        path: 'not-found',
        loadChildren: () => import('./pages/not-found/not-found.component').then(c => c.NotFoundComponent)    
    },
    {
        path:'support',
        loadChildren: () => import('./pages/support/support.component').then(c => c.SupportComponent)
    },
    {
        path:'products',
        loadChildren: () => import('./pages/products/products.component').then(c => c.ProductsComponent)
    },
    {
        path:'orders',
        loadChildren: () => import('./pages/orders/orders.component').then(c => c.OrdersComponent)
    }
];