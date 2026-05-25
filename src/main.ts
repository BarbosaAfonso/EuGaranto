import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// 1. Importar o carregador dos PWA Elements
import { defineCustomElements } from '@ionic/pwa-elements/loader';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));

// 2. Iniciar os elementos da interface web (para a câmara funcionar no PC)
defineCustomElements(window);