import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject, type OnDestroy, type OnInit } from '@angular/core';
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
  alertCircleOutline,
  businessOutline,
  calendarOutline,
  closeCircleOutline,
  cloudOutline,
  locationOutline,
  partlySunnyOutline,
  rainyOutline,
  searchOutline,
  settingsOutline,
  sunnyOutline,
  timeOutline,
  trashOutline
} from 'ionicons/icons';
import { EMPTY, Subject, type Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { DescricaoClimaPipe } from '../pipes/descricao-clima.pipe';
import { type ClimaAtual, ClimaService, type ResultadoGeocodificacao } from '../services/clima.service';
import { HistoricoService } from '../services/historico';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
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
    DecimalPipe,
    DatePipe
  ],
  providers: [DecimalPipe, DatePipe],
})
export class HomePage implements OnInit, OnDestroy {
  private climaService = inject(ClimaService);
  private historicoService = inject(HistoricoService);
  private router = inject(Router);

  lat = -8.0543;
  lon = -34.8813;
  cidadeAtual = 'Recife, PE';
  climaAtual: ClimaAtual | null = null;
  carregandoClima = true;

  termoBusca = '';
  historicoCidades: string[] = [];
  resultadosBusca: ResultadoGeocodificacao[] = [];
  buscando = false;
  nenhumResultado = false;
  dataHoje = new Date();

  private buscaSubject = new Subject<string>();
  private subBusca?: Subscription;

  constructor() {
    addIcons({
      locationOutline,
      partlySunnyOutline,
      sunnyOutline,
      rainyOutline,
      cloudOutline,
      searchOutline,
      closeCircleOutline,
      timeOutline,
      trashOutline,
      calendarOutline,
      businessOutline,
      alertCircleOutline,
      settingsOutline
    });
  }

  ngOnInit(): void {
    this.historicoCidades = this.historicoService.obterHistorico();
    this.carregarClimaDestaque();

    this.subBusca = this.buscaSubject
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        switchMap((termo) => {
          if (!termo || termo.trim().length < 2) {
            this.buscando = false;
            this.resultadosBusca = [];
            this.nenhumResultado = false;
            return EMPTY;
          }
          this.buscando = true;
          this.nenhumResultado = false;
          return this.climaService.buscarCidades(termo.trim());
        })
      )
      .subscribe({
        next: (res) => {
          this.buscando = false;
          this.resultadosBusca = res.results || [];
          this.nenhumResultado =
            this.resultadosBusca.length === 0 && this.termoBusca.trim().length >= 2;
        },
        error: () => {
          this.buscando = false;
          this.resultadosBusca = [];
        },
      });
  }

  ngOnDestroy(): void {
    this.subBusca?.unsubscribe();
  }

  carregarClimaDestaque(): void {
    this.carregandoClima = true;
    this.climaService.getClimaAtual(this.lat, this.lon).subscribe({
      next: (dados) => {
        this.climaAtual = dados;
        this.carregandoClima = false;
      },
      error: () => {
        this.carregandoClima = false;
      },
    });
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

  onInputBusca(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input?.value || '';
    this.termoBusca = valor;
    this.buscaSubject.next(valor);
  }

  selecionarCidade(cidade: ResultadoGeocodificacao): void {
    const nomeCompleto = [cidade.name, cidade.admin1, cidade.country]
      .filter(Boolean)
      .join(', ');

    this.historicoService.adicionarCidade(nomeCompleto);
    this.historicoCidades = this.historicoService.obterHistorico();
    this.limparBusca();

    this.router.navigate(['/detalhes'], {
      queryParams: {
        lat: cidade.latitude,
        lon: cidade.longitude,
        cidade: nomeCompleto,
      },
    });
  }

  abrirCidadeHistorico(nomeCidade: string): void {
    const termo = nomeCidade.split(',')[0].trim();
    this.climaService.buscarCidades(termo).subscribe({
      next: (res) => {
        if (res.results && res.results.length > 0) {
          this.selecionarCidade(res.results[0]);
        }
      },
    });
  }

  limparBusca(): void {
    this.termoBusca = '';
    this.resultadosBusca = [];
    this.nenhumResultado = false;
  }

  limparHistorico(): void {
    this.historicoService.limparHistorico();
    this.historicoCidades = [];
  }

  removerCidade(event: Event, cidade: string): void {
    event.stopPropagation();
    this.historicoService.removerCidade(cidade);
    this.historicoCidades = this.historicoService.obterHistorico();
  }
}