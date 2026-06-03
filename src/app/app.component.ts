import { Component, OnInit } from '@angular/core';
import { WarrantyService } from './services/warranty.service';
import { ThemeService } from './services/theme.service';

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {

  constructor(
    private warrantyService: WarrantyService,
    private themeService: ThemeService 
  ) {}

  async ngOnInit() {
    this.themeService.init();

    try {
      const { ScreenOrientation } = await import('@capacitor/screen-orientation');
      await ScreenOrientation.lock({ orientation: 'portrait' });
    } catch (e) {
      console.log('ScreenOrientation apenas disponível em dispositivo físico.');
    }

    await this.warrantyService.init();
  }
}