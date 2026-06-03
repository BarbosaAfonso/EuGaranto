import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfiguracaoNotificacoesPage } from './configuracao-notificacoes.page';

const routes: Routes = [
  {
    path: '',
    component: ConfiguracaoNotificacoesPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfiguracaoNotificacoesPageRoutingModule {}
