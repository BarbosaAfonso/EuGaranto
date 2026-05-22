import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'warranty-new',
    loadChildren: () => import('./pages/warranty-new/warranty-new.module').then(m => m.WarrantyNewPageModule)
  },
  {
    path: 'warranty-detail/:id',   // Req. 5 — parâmetros entre páginas
    loadChildren: () => import('./pages/warranty-detail/warranty-detail.module').then(m => m.WarrantyDetailPageModule)
  },
  {
    path: 'category-new',
    loadChildren: () => import('./pages/category-new/category-new.module').then(m => m.CategoryNewPageModule)
  },
  {
    path: 'alert-new/:warrantyId', // Req. 5 — parâmetros entre páginas
    loadChildren: () => import('./pages/alert-new/alert-new.module').then(m => m.AlertNewPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
