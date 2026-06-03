import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ConfiguracaoNotificacoesPageRoutingModule } from './configuracao-notificacoes-routing.module';
import { ConfiguracaoNotificacoesPage } from './configuracao-notificacoes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConfiguracaoNotificacoesPageRoutingModule,
  ],
  declarations: [ConfiguracaoNotificacoesPage],
})
export class ConfiguracaoNotificacoesPageModule {}
