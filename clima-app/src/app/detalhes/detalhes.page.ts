import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonContent,
  IonFooter,
  IonIcon,
  IonLabel,
  IonSpinner,
  IonTabBar,
  IonTabButton
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  businessOutline,
  calendarOutline,
  chevronBackOutline,
  cloudOutline,
  locationOutline,
  partlySunnyOutline,
  rainyOutline,
  refreshOutline,
  settingsOutline,
  sunnyOutline,
  thermometerOutline,
  waterOutline
} from 'ionicons/icons';

import { DestaqueAlertaDirective } from '../directives/destaque-alerta.directive';
import { FaixaTemperaturaDirective } from '../directives/faixa-temperatura.directive';
import { DescricaoClimaPipe } from '../pipes/descricao-clima.pipe';
import { TemperaturaPipe } from '../pipes/temperatura.pipe';
import { VentoPipe } from '../pipes/vento.pipe';
import { type ClimaAtual, ClimaService, type PrevisaoHoraria } from '../services/clima.service';
import { ConfiguracoesService } from '../services/configuracoes.service';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonContent,
    IonIcon,
    IonSpinner,
    IonFooter,
    IonTabBar,
    IonTabButton,
    IonLabel,
    DescricaoClimaPipe,
    TemperaturaPipe,
    VentoPipe,
    FaixaTemperaturaDirective,
    DestaqueAlertaDirective,
    DecimalPipe,
    DatePipe
  ],
  providers: [DecimalPipe, DatePipe],
})
export class DetalhesPage implements OnInit {
  private climaService = inject(ClimaService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  public configService = inject(ConfiguracoesService);

  lat = -8.0543;
  lon = -34.8813;
  cidade = 'Recife, PE';

  climaAtual: ClimaAtual | null = null;
  previsaoHoraria: PrevisaoHoraria | null = null;
  carregandoAtual = true;
  carregandoHorario = true;
  erroAtual = '';
  erroHorario = '';
  horasExibidas: number[] = [];

  constructor() {
    addIcons({
      chevronBackOutline,
      refreshOutline,
      locationOutline,
      partlySunnyOutline,
      sunnyOutline,
      rainyOutline,
      cloudOutline,
      thermometerOutline,
      waterOutline,
      calendarOutline,
      businessOutline,
      alertCircleOutline,
      settingsOutline
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['lat'] && params['lon']) {
        this.lat = parseFloat(params['lat']);
        this.lon = parseFloat(params['lon']);
        if (params['cidade']) {
          this.cidade = params['cidade'];
        }
      }
      this.carregarClimaAtual();
      this.carregarPrevisaoHoraria();
    });
  }

  carregarClimaAtual(): void {
    this.carregandoAtual = true;
    this.erroAtual = '';
    this.climaService.getClimaAtual(this.lat, this.lon).subscribe({
      next: (data) => {
        this.climaAtual = data;
        this.carregandoAtual = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.erroAtual = 'Falha ao carregar clima atual.';
        this.carregandoAtual = false;
        this.cdr.markForCheck();
      },
    });
  }

  carregarPrevisaoHoraria(): void {
    this.carregandoHorario = true;
    this.erroHorario = '';
    this.climaService.getPrevisaoHoraria(this.lat, this.lon).subscribe({
      next: (data) => {
        this.previsaoHoraria = data;
        const agora = new Date();
        this.horasExibidas = data.hourly.time
          .map((t, i) => ({ time: new Date(t), i }))
          .filter((x) => x.time >= agora)
          .slice(0, 8)
          .map((x) => x.i);
        this.carregandoHorario = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.erroHorario = 'Falha ao carregar previsão horária.';
        this.carregandoHorario = false;
        this.cdr.markForCheck();
      },
    });
  }

  atualizarTodas(): void {
    this.climaService.limparCache();
    this.carregarClimaAtual();
    this.carregarPrevisaoHoraria();
  }

  obterIconeClima(code?: number): string {
    if (code == null) {
      return 'partly-sunny-outline';
    }
    if (code === 0 || code === 1) {
      return 'sunny-outline';
    }
    if (code === 2) {
      return 'partly-sunny-outline';
    }
    if (code >= 51) {
      return 'rainy-outline';
    }
    return 'cloud-outline';
  }
}