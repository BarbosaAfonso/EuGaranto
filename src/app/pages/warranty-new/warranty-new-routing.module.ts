import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WarrantyNewPage } from './warranty-new.page';

const routes: Routes = [
  {
    path: '',
    component: WarrantyNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarrantyNewPageRoutingModule {}
