import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonSelect,
  IonSelectOption,
} from '@ionic/angular';

@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.page.html',
  styleUrls: ['./configuracoes.page.scss'],
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonButtons, IonBackButton, IonCard, IonCardContent, IonCardHeader,
    IonCardTitle, IonList, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption,
  ],
})
export class ConfiguracoesPage {
  unidadeTemperatura = 'celsius';
  notificacoesAtivadas = true;
  temaEscuro = false;
  idiomaApp = 'pt-BR';

  constructor() {}
}
