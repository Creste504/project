import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  IonLabel,
  IonItem,
  IonList,
  IonBadge,
  IonSpinner,
  IonButton,
} from '@ionic/angular';
import { ClimaService, PrevisaoDiaria } from '../services/clima.service';
import { DescricaoClimaPipe } from '../pipes/descricao-clima.pipe';
import { NivelUvPipe } from '../pipes/nivel-uv.pipe';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.page.html',
  styleUrls: ['./alertas.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonButtons,
    IonBackButton,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonLabel,
    IonItem,
    IonList,
    IonBadge,
    IonSpinner,
    DescricaoClimaPipe,
    NivelUvPipe,
    DatePipe,
    DecimalPipe,
  ],
  providers: [DatePipe, DecimalPipe],
})
export class AlertasPage implements OnInit {
  // Coordenadas padrão: Recife, PE
  lat = -8.0543;
  lon = -34.8813;
  cidade = 'Recife, PE';

  previsaoDiaria: PrevisaoDiaria | null = null;
  carregando = true;
  erro = '';

  constructor(
    private climaService: ClimaService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
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

  carregarPrevisaoDiaria() {
    this.carregando = true;
    this.erro = '';
    this.climaService.getPrevisaoDiaria(this.lat, this.lon).subscribe({
      next: (data) => {
        this.previsaoDiaria = data;
        this.carregando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Erro ao buscar previsão diária:', err);
        this.erro = 'Falha ao carregar previsão diária da API.';
        this.carregando = false;
        this.cdr.markForCheck();
      },
    });
  }

  recarregar() {
    this.climaService.limparCache();
    this.carregarPrevisaoDiaria();
  }

  temAlerta(i: number): boolean {
    if (!this.previsaoDiaria) return false;
    const d = this.previsaoDiaria.daily;
    return d.precipitation_sum[i] > 5 || d.uv_index_max[i] > 7 || d.weather_code[i] >= 80;
  }

  get diasIndices(): number[] {
    return this.previsaoDiaria ? this.previsaoDiaria.daily.time.map((_, i) => i) : [];
  }

  trackByDia(index: number): number {
    return index;
  }
}
