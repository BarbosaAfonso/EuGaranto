import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { WarrantyDetailPageRoutingModule } from './warranty-detail-routing.module';
import { WarrantyDetailPage } from './warranty-detail.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, WarrantyDetailPageRoutingModule],
  declarations: [WarrantyDetailPage],
})
export class WarrantyDetailPageModule {}
