import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WarrantyNewPageRoutingModule } from './warranty-new-routing.module';
import { WarrantyNewPage } from './warranty-new.page';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, IonicModule, WarrantyNewPageRoutingModule],
  declarations: [WarrantyNewPage],
})
export class WarrantyNewPageModule {}
