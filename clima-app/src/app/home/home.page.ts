import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonNote,
  IonBadge,
} from '@ionic/angular';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';
import { ClimaService, ResultadoGeocodificacao } from '../services/clima.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CommonModule,
    FormsModule,
    RouterLink,
    IonButton,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonSpinner,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonNote,
    IonBadge,
  ],
})
export class HomePage implements OnInit, OnDestroy {
  termoBusca = '';
  resultadosBusca: ResultadoGeocodificacao[] = [];
  buscando = false;
  nenhumResultado = false;

  private buscaSubject = new Subject<string>();
  private subBusca?: Subscription;

  constructor(
    private climaService: ClimaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.subBusca = this.buscaSubject
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        switchMap((termo) => {
          if (!termo || termo.trim().length < 2) {
            this.buscando = false;
            this.resultadosBusca = [];
            this.nenhumResultado = false;
            return [];
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
          this.nenhumResultado = this.resultadosBusca.length === 0 && this.termoBusca.trim().length >= 2;
        },
        error: (err) => {
          console.error('Erro ao buscar cidades:', err);
          this.buscando = false;
          this.resultadosBusca = [];
        },
      });
  }

  ngOnDestroy() {
    this.subBusca?.unsubscribe();
  }

  onInputBusca(event: any) {
    const valor = event.target?.value || '';
    this.termoBusca = valor;
    this.buscaSubject.next(valor);
  }

  selecionarCidade(cidade: ResultadoGeocodificacao) {
    const nomeCompleto = [cidade.name, cidade.admin1, cidade.country]
      .filter(Boolean)
      .join(', ');

    this.router.navigate(['/detalhes'], {
      queryParams: {
        lat: cidade.latitude,
        lon: cidade.longitude,
        cidade: nomeCompleto,
      },
    });
  }

  limparBusca() {
    this.termoBusca = '';
    this.resultadosBusca = [];
    this.nenhumResultado = false;
  }
}
