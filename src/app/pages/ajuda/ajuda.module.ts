import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AjudaPageRoutingModule } from './ajuda-routing.module';
import { AjudaPage } from './ajuda.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AjudaPageRoutingModule,
  ],
  declarations: [AjudaPage],
})
export class AjudaPageModule {}
