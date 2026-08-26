import { Routes } from '@angular/router';
import { roleGuard, guestGuard } from '../core/auth.guard';

export const routes: Routes = [
  // Default: Landing page
  {
    path: '',
    loadComponent: () =>
      import('../features/landing/landing').then((m) => m.LandingComponent),
    pathMatch: 'full'
  },

  // ── Auth routes (guest-only) ──────────────────────────────
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('../features/auth/login').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('../features/auth/signup').then((m) => m.SignupComponent),
  },
  {
    path: 'forgot-password',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('../features/auth/forgot-password').then((m) => m.ForgotPasswordComponent),
  },
  // Reset-password must NOT be behind guestGuard — Supabase gives a session on arrival
  {
    path: 'reset-password',
    loadComponent: () =>
      import('../features/auth/reset-password').then((m) => m.ResetPasswordComponent),
  },

  // ── Admin shell + children ────────────────────────────────
  {
    path: 'admin',
    canActivate: [roleGuard('admin')],
    loadComponent: () =>
      import('../features/admin/dashboard').then((m) => m.AdminDashboardComponent),
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },
      {
        path: 'products',
        loadComponent: () =>
          import('../features/admin/products').then((m) => m.AdminProductsComponent),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('../features/admin/orders').then((m) => m.AdminOrdersComponent),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('../features/admin/analytics').then((m) => m.AdminAnalyticsComponent),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('../features/account/account').then((m) => m.AccountComponent),
      },
    ],
  },

  // ── Delivery shell + children ─────────────────────────────
  {
    path: 'delivery',
    canActivate: [roleGuard('delivery')],
    loadComponent: () =>
      import('../features/delivery/dashboard').then((m) => m.DeliveryDashboardComponent),
    children: [
      { path: '', redirectTo: 'orders', pathMatch: 'full' },
      {
        path: 'orders',
        loadComponent: () =>
          import('../features/delivery/orders').then((m) => m.DeliveryOrdersComponent),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('../features/delivery/analytics').then((m) => m.DeliveryAnalyticsComponent),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('../features/account/account').then((m) => m.AccountComponent),
      },
    ],
  },

  // ── Customer shell + children ─────────────────────────────
  {
    path: 'customer',
    canActivate: [roleGuard('customer')],
    loadComponent: () =>
      import('../features/customer/dashboard').then((m) => m.CustomerDashboardComponent),
    children: [
      { path: '', redirectTo: 'browse', pathMatch: 'full' },
      {
        path: 'browse',
        loadComponent: () =>
          import('../features/customer/browse').then((m) => m.CustomerBrowseComponent),
      },
      {
        path: 'product/:id',
        loadComponent: () =>
          import('../features/customer/product-details').then((m) => m.ProductDetailsComponent),
      },
      {
        path: 'cart',
        loadComponent: () =>
          import('../features/customer/cart').then((m) => m.CustomerCartComponent),
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('../features/customer/checkout').then((m) => m.CustomerCheckoutComponent),
      },
      {
        path: 'my-orders',
        loadComponent: () =>
          import('../features/customer/my-orders').then((m) => m.CustomerMyOrdersComponent),
      },
      {
        path: 'account',
        loadComponent: () =>
          import('../features/account/account').then((m) => m.AccountComponent),
      },
    ],
  },

  // Wildcard: back to login
  { path: '**', redirectTo: 'login' },
];
