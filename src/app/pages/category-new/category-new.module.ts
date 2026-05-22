import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CategoryNewPageRoutingModule } from './category-new-routing.module';
import { CategoryNewPage } from './category-new.page';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, CategoryNewPageRoutingModule],
  declarations: [CategoryNewPage],
})
export class CategoryNewPageModule {}
