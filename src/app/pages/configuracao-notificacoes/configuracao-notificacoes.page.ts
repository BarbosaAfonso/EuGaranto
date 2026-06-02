import { Component, OnInit } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

type NotificationSettingKey = 'pushNotifications' | 'emailAlerts' | 'expirationWarning';

interface NotificationSetting {
  key: NotificationSettingKey;
  label: string;
  description: string;
}

@Component({
  standalone: false,
  selector: 'app-configuracao-notificacoes',
  templateUrl: './configuracao-notificacoes.page.html',
  styleUrls: ['./configuracao-notificacoes.page.scss'],
})
export class ConfiguracaoNotificacoesPage implements OnInit {
  settings: NotificationSetting[] = [
    {
      key: 'pushNotifications',
      label: 'Notificações Push',
      description: 'Receber alertas diretamente no telemóvel.',
    },
    {
      key: 'emailAlerts',
      label: 'Alertas por Email',
      description: 'Receber novidades e avisos importantes por email.',
    },
    {
      key: 'expirationWarning',
      label: 'Aviso de Expiração (1 mês antes)',
      description: 'Ser avisado antes de uma garantia terminar.',
    },
  ];

  values: Record<NotificationSettingKey, boolean> = {
    pushNotifications: true,
    emailAlerts: true,
    expirationWarning: true,
  };

  private readonly storagePrefix = 'notification_setting_';

  async ngOnInit() {
    await this.loadSettings();
  }

  async updateSetting(key: NotificationSettingKey, enabled: boolean) {
    this.values[key] = enabled;
    await Preferences.set({
      key: `${this.storagePrefix}${key}`,
      value: JSON.stringify(enabled),
    });
  }

  private async loadSettings() {
    await Promise.all(
      this.settings.map(async setting => {
        const { value } = await Preferences.get({
          key: `${this.storagePrefix}${setting.key}`,
        });

        if (value !== null) {
          this.values[setting.key] = JSON.parse(value);
        }
      })
    );
  }
}
