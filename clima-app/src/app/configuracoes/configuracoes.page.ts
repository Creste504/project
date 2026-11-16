import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonFooter,
  IonIcon,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonTabBar,
  IonTabButton,
  IonToggle
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  businessOutline,
  calendarOutline,
  chevronBackOutline,
  globeOutline,
  informationCircleOutline,
  notificationsOutline,
  partlySunnyOutline,
  settingsOutline,
  sunnyOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonIcon,
    IonToggle,
    IonSelect,
    IonSelectOption,
    IonFooter,
    IonTabBar,
    IonTabButton,
    IonLabel
  ],
})
export class ConfiguracoesPage {
  unidadeTemperatura: 'celsius' | 'fahrenheit' = 'celsius';
  unidadeVento: 'kmh' | 'mph' = 'kmh';
  notificacoesAtivadas = true;
  temaEscuro = false;
  idiomaApp = 'pt-BR';

  constructor() {
    addIcons({
      chevronBackOutline,
      sunnyOutline,
      globeOutline,
      notificationsOutline,
      informationCircleOutline,
      partlySunnyOutline,
      calendarOutline,
      businessOutline,
      alertCircleOutline,
      settingsOutline
    });

    const temaSalvo = localStorage.getItem('darkMode');
    if (temaSalvo === 'true') {
      this.temaEscuro = true;
      document.body.classList.add('dark');
    }
  }

  selecionarTemp(unidade: 'celsius' | 'fahrenheit'): void {
    this.unidadeTemperatura = unidade;
  }

  selecionarVento(unidade: 'kmh' | 'mph'): void {
    this.unidadeVento = unidade;
  }

  alternarModoEscuro(): void {
    document.body.classList.toggle('dark', this.temaEscuro);
    localStorage.setItem('darkMode', String(this.temaEscuro));
  }
}