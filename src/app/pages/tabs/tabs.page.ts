import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage {

  constructor(
    private router: Router,
    private actionSheet: ActionSheetController,
  ) {}

  /**
   * CORREÇÃO HEURÍSTICA #2: o botão "+" mostra opções claras
   * em vez de criar algo indeterminado.
   */
  async openAdd(e: Event) {
    e.stopPropagation();
    const sheet = await this.actionSheet.create({
      header: 'O que pretende adicionar?',
      buttons: [
        {
          text: 'Nova Garantia',
          icon: 'shield-checkmark-outline',
          handler: () => this.router.navigate(['/warranty-new'])
        },
        {
          text: 'Nova Categoria',
          icon: 'folder-open-outline',
          handler: () => this.router.navigate(['/category-new'])
        },
        { text: 'Cancelar', role: 'cancel', icon: 'close-outline' }
      ]
    });
    await sheet.present();
  }
}
