import { Component } from '@angular/core';

@Component({
  standalone: false,
  selector: 'app-ajuda',
  templateUrl: './ajuda.page.html',
  styleUrls: ['./ajuda.page.scss'],
})
export class AjudaPage {
  faqs = [
    {
      question: 'Como funciona o OCR?',
      answer: 'O OCR ajuda a reconhecer texto numa fotografia do talão ou documento, para preencher dados da garantia mais depressa.',
    },
    {
      question: 'Como adicionar garantia?',
      answer: 'No separador inicial, toca no botão de adicionar e preenche os dados do produto, datas, categoria e comprovativo.',
    },
    {
      question: 'Como recebo alertas de expiração?',
      answer: 'Ativa os avisos nas definições de notificações para receber lembretes antes das garantias terminarem.',
    },
  ];
}
