import { CommonModule, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, type OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  addCircleOutline,
  alertCircleOutline,
  businessOutline,
  calendarOutline,
  chevronBackOutline,
  closeCircleOutline,
  cloudOutline,
  moonOutline,
  partlySunnyOutline,
  rainyOutline,
  refreshOutline,
  searchOutline,
  settingsOutline,
  sunnyOutline,
  trashOutline
} from 'ionicons/icons';
import { forkJoin } from 'rxjs';

import { DestaqueAlertaDirective } from '../directives/destaque-alerta.directive';
import { FaixaTemperaturaDirective } from '../directives/faixa-temperatura.directive';
import { DescricaoClimaPipe } from '../pipes/descricao-clima.pipe';
import { type ClimaAtual, ClimaService, type ResultadoGeocodificacao } from '../services/clima.service';

interface CidadeSalva {
  nome: string;
  lat: number;
  lon: number;
  clima?: ClimaAtual;
  carregando?: boolean;
  erro?: string;
}

@Component({
  selector: 'app-cidades',
  templateUrl: './cidades.page.html',
  styleUrls: ['./cidades.page.scss'],
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
    FaixaTemperaturaDirective,
    DestaqueAlertaDirective,
    DecimalPipe
  ],
  providers: [DecimalPipe],
})
export class CidadesPage implements OnInit {
  private climaService = inject(ClimaService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  cidades: CidadeSalva[] = [
    { nome: 'Recife, PE', lat: -8.0543, lon: -34.8813 },
    { nome: 'São Paulo, SP', lat: -23.5505, lon: -46.6333 },
    { nome: 'Rio de Janeiro, RJ', lat: -22.9068, lon: -43.1729 },
    { nome: 'Curitiba, PR', lat: -25.4284, lon: -49.2733 },
    { nome: 'Fortaleza, CE', lat: -3.7172, lon: -38.5433 },
    { nome: 'Manaus, AM', lat: -3.1019, lon: -60.025 }
  ];

  carregandoGeral = true;
  termoBusca = '';
  buscando = false;
  sugestoes: ResultadoGeocodificacao[] = [];
  nenhumResultado = false;
  private debounceTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    addIcons({
      chevronBackOutline,
      refreshOutline,
      searchOutline,
      closeCircleOutline,
      addCircleOutline,
      partlySunnyOutline,
      sunnyOutline,
      rainyOutline,
      cloudOutline,
      moonOutline,
      trashOutline,
      calendarOutline,
      businessOutline,
      alertCircleOutline,
      settingsOutline
    });
  }

  ngOnInit(): void {
    this.carregarTodasEmParalelo();
  }

  carregarTodasEmParalelo(): void {
    if (this.cidades.length === 0) {
      this.carregandoGeral = false;
      this.cdr.markForCheck();
      return;
    }

    this.carregandoGeral = true;
    this.cidades.forEach((c) => {
      c.carregando = true;
      c.erro = '';
    });

    const requisicoes = this.cidades.map((c) =>
      this.climaService.getClimaAtual(c.lat, c.lon)
    );

    forkJoin(requisicoes).subscribe({
      next: (resultados) => {
        resultados.forEach((data, i) => {
          this.cidades[i].clima = data;
          this.cidades[i].carregando = false;
        });
        this.carregandoGeral = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.cidades.forEach((c) => {
          c.erro = 'Erro ao carregar';
          c.carregando = false;
        });
        this.carregandoGeral = false;
        this.cdr.markForCheck();
      },
    });
  }

  onPesquisar(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input?.value?.trim() || '';
    this.termoBusca = input?.value || '';

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    if (valor.length < 2) {
      this.sugestoes = [];
      this.nenhumResultado = false;
      this.buscando = false;
      this.cdr.markForCheck();
      return;
    }

    this.debounceTimer = setTimeout(() => {
      this.buscando = true;
      this.nenhumResultado = false;
      this.cdr.markForCheck();

      this.climaService.buscarCidades(valor).subscribe({
        next: (res) => {
          this.buscando = false;
          this.sugestoes = res.results || [];
          this.nenhumResultado = this.sugestoes.length === 0;
          this.cdr.markForCheck();
        },
        error: () => {
          this.buscando = false;
          this.sugestoes = [];
          this.cdr.markForCheck();
        },
      });
    }, 400);
  }

  adicionarCidade(resultado: ResultadoGeocodificacao): void {
    const nome = [resultado.name, resultado.admin1, resultado.country]
      .filter(Boolean)
      .join(', ');

    const novaCidade: CidadeSalva = {
      nome,
      lat: resultado.latitude,
      lon: resultado.longitude,
      carregando: true,
    };

    this.cidades.unshift(novaCidade);
    this.limparBusca();

    this.climaService.getClimaAtual(novaCidade.lat, novaCidade.lon).subscribe({
      next: (clima) => {
        novaCidade.clima = clima;
        novaCidade.carregando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        novaCidade.erro = 'Erro ao consultar clima';
        novaCidade.carregando = false;
        this.cdr.markForCheck();
      },
    });
  }

  abrirDetalhesCidade(cidade: CidadeSalva): void {
    this.router.navigate(['/detalhes'], {
      queryParams: {
        lat: cidade.lat,
        lon: cidade.lon,
        cidade: cidade.nome,
      },
    });
  }

  removerCidade(event: Event, index: number): void {
    event.stopPropagation();
    this.cidades.splice(index, 1);
    this.cdr.markForCheck();
  }

  limparBusca(): void {
    this.termoBusca = '';
    this.sugestoes = [];
    this.nenhumResultado = false;
    this.cdr.markForCheck();
  }

  atualizarTodas(): void {
    this.climaService.limparCache();
    this.carregarTodasEmParalelo();
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