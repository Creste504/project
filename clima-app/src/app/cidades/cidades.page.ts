import { CommonModule, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  IonLabel,
  IonItem,
  IonList,
  IonBadge,
  IonSpinner,
  IonButton,
  IonSearchbar,
  IonNote,
} from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { ClimaService, ClimaAtual, ResultadoGeocodificacao } from '../services/clima.service';
import { DescricaoClimaPipe } from '../pipes/descricao-clima.pipe';
import { FaixaTemperaturaDirective } from '../directives/faixa-temperatura.directive';
import { DestaqueAlertaDirective } from '../directives/destaque-alerta.directive';

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
    IonSearchbar,
    IonNote,
    DescricaoClimaPipe,
    FaixaTemperaturaDirective,
    DestaqueAlertaDirective,
    DecimalPipe,
  ],
  providers: [DecimalPipe],
})
export class CidadesPage implements OnInit {
  cidades: CidadeSalva[] = [
    { nome: 'Recife, PE', lat: -8.0543, lon: -34.8813 },
    { nome: 'São Paulo, SP', lat: -23.5505, lon: -46.6333 },
    { nome: 'Rio de Janeiro, RJ', lat: -22.9068, lon: -43.1729 },
    { nome: 'Curitiba, PR', lat: -25.4284, lon: -49.2733 },
    { nome: 'Fortaleza, CE', lat: -3.7172, lon: -38.5433 },
    { nome: 'Manaus, AM', lat: -3.1019, lon: -60.025 },
  ];

  carregandoGeral = true;

  // Busca e adição de novas cidades
  termoBusca = '';
  buscando = false;
  sugestoes: ResultadoGeocodificacao[] = [];
  nenhumResultado = false;

  constructor(
    private climaService: ClimaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarTodasEmParalelo();
  }

  carregarTodasEmParalelo() {
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

  // 🔍 Pesquisa de cidades via API Geocoding
  onPesquisar(event: any) {
    const valor = event.target?.value?.trim() || '';
    this.termoBusca = valor;
    if (valor.length < 2) {
      this.sugestoes = [];
      this.nenhumResultado = false;
      this.cdr.markForCheck();
      return;
    }

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
      error: (err) => {
        console.error(err);
        this.buscando = false;
        this.sugestoes = [];
        this.cdr.markForCheck();
      },
    });
  }

  // ➕ Adiciona a cidade pesquisada à lista e busca o clima
  adicionarCidade(resultado: ResultadoGeocodificacao) {
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
    this.termoBusca = '';
    this.sugestoes = [];
    this.cdr.markForCheck();

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

  removerCidade(index: number) {
    this.cidades.splice(index, 1);
    this.cdr.markForCheck();
  }

  limparBusca() {
    this.termoBusca = '';
    this.sugestoes = [];
    this.nenhumResultado = false;
    this.cdr.markForCheck();
  }

  atualizarTodas() {
    this.climaService.limparCache();
    this.carregarTodasEmParalelo();
  }
}
