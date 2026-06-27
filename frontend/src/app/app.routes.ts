import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { ManagerGuard } from './core/guards/manager.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./pages/checkout/checkout.component').then(
            (c) => c.CheckoutComponent,
          ),
      },
      {path:'thanks',
        loadComponent: () =>
          import('./pages/thanks/thanks.component').then(
            (c) => c.ThanksComponent,
          ),
      },
      {
        path: 'order-success',
        loadComponent: () =>
          import('./pages/thanks/thanks.component').then(
            (c) => c.ThanksComponent,
          ),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('./pages/home/home.component').then((c) => c.HomeComponent),
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products/components/products.component').then(
            (c) => c.ProductsComponent,
          ),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('./features/cart/component/cart.component').then((c) => c.CartComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./features/orders/component/orders.component').then(
            (c) => c.OrdersComponent,
          ),
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./pages/product-detail/product-detail.component').then(
            (c) => c.ProductDetailComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/profile/profile.component').then(
            (c) => c.ProfileComponent,
          ),
      },
      {
        path: 'support',
        loadComponent: () =>
          import('./pages/support/support.component').then(
            (c) => c.SupportComponent,
          ),
      },
    ],
  },

  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./pages/login/login.component').then((c) => c.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/register/register.component').then(
            (c) => c.RegisterComponent,
          ),
      },
    ],
  },

  {
    path: 'not-found',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then(
        (c) => c.NotFoundComponent,
      ),
  },
  {
    path: 'oauth-success',
    loadComponent: () =>
      import('./pages/oauth-success/oauth-success.component').then(
        (c) => c.OAuthSuccessComponent,
      ),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
  {
  path: 'manager',
  canActivate: [ManagerGuard],
  children: [
    {
      path: 'orders',
      loadComponent: () =>
        import('./features/manager/orders/orders.component')
          .then(c => c.OrdersManagerComponent),
    },
    {
      path: 'products',
      loadComponent: () =>
        import('./features/manager/products/products.component')
          .then(c => c.ProductsComponent),
    },
  ],
}
];
