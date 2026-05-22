import { Component, OnInit } from '@angular/core';
import { WarrantyService } from './services/warranty.service';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {

  constructor(private warrantyService: WarrantyService) {}

  async ngOnInit() {
    // Req. 12 — Bloquear landscape com Capacitor
    try {
      const { ScreenOrientation } = await import('@capacitor/screen-orientation');
      await ScreenOrientation.lock({ orientation: 'portrait' });
    } catch (e) {
      // Não disponível no browser, apenas no dispositivo físico
      console.log('ScreenOrientation apenas disponível em dispositivo físico.');
    }

    // Inicializar serviço de dados (carrega JSON + Ionic Storage)
    await this.warrantyService.init();
  }
}
