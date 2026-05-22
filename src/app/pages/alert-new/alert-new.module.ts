import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AlertNewPageRoutingModule } from './alert-new-routing.module';
import { AlertNewPage } from './alert-new.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AlertNewPageRoutingModule],
  declarations: [AlertNewPage],
})
export class AlertNewPageModule {}
