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
  funnelOutline,
  informationCircleOutline,
  partlySunnyOutline,
  rainyOutline,
  refreshOutline,
  settingsOutline,
  sunnyOutline
} from 'ionicons/icons';

import { DestaqueAlertaDirective } from '../directives/destaque-alerta.directive';
import { FaixaTemperaturaDirective } from '../directives/faixa-temperatura.directive';
import { DescricaoClimaPipe } from '../pipes/descricao-clima.pipe';
import { NivelUvPipe } from '../pipes/nivel-uv.pipe';
import { TemperaturaPipe } from '../pipes/temperatura.pipe';
import { VentoPipe } from '../pipes/vento.pipe';
import { ClimaService, type PrevisaoDiaria } from '../services/clima.service';
import { ConfiguracoesService } from '../services/configuracoes.service';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.page.html',
  styleUrls: ['./alertas.page.scss'],
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
    NivelUvPipe,
    TemperaturaPipe,
    VentoPipe,
    FaixaTemperaturaDirective,
    DestaqueAlertaDirective,
    DatePipe,
    DecimalPipe
  ],
  providers: [DatePipe, DecimalPipe],
})
export class AlertasPage implements OnInit {
  private climaService = inject(ClimaService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  public configService = inject(ConfiguracoesService);

  lat = -8.0543;
  lon = -34.8813;
  cidade = 'Recife, PE';

  previsaoDiaria: PrevisaoDiaria | null = null;
  carregando = true;
  erro = '';
  apenasAlertas = false;

  constructor() {
    addIcons({
      chevronBackOutline,
      refreshOutline,
      funnelOutline,
      partlySunnyOutline,
      sunnyOutline,
      rainyOutline,
      cloudOutline,
      informationCircleOutline,
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
      this.carregarPrevisaoDiaria();
    });
  }

  carregarPrevisaoDiaria(): void {
    this.carregando = true;
    this.erro = '';
    this.climaService.getPrevisaoDiaria(this.lat, this.lon).subscribe({
      next: (data) => {
        this.previsaoDiaria = data;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.erro = 'Falha ao carregar previsão diária da API.';
        this.carregando = false;
        this.cdr.markForCheck();
      },
    });
  }

  recarregar(): void {
    this.climaService.limparCache();
    this.carregarPrevisaoDiaria();
  }

  alternarFiltroAlertas(): void {
    this.apenasAlertas = !this.apenasAlertas;
    this.cdr.markForCheck();
  }

  temAlerta(i: number): boolean {
    if (!this.previsaoDiaria) {
      return false;
    }
    const d = this.previsaoDiaria.daily;
    return d.precipitation_sum[i] > 5 || d.uv_index_max[i] > 7 || d.weather_code[i] >= 80;
  }

  get diasIndices(): number[] {
    if (!this.previsaoDiaria) {
      return [];
    }
    const todos = this.previsaoDiaria.daily.time.map((_, i) => i);
    return this.apenasAlertas ? todos.filter((i) => this.temAlerta(i)) : todos;
  }

  obterIconeClima(code: number): string {
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