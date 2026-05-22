import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoryNewPage } from './category-new.page';

const routes: Routes = [
  {
    path: '',
    component: CategoryNewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryNewPageRoutingModule {}
