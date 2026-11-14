import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel, IonItem,
  IonList, IonBadge, IonSpinner, IonGrid, IonRow, IonCol, IonButton,
} from '@ionic/angular';
import { ClimaService, ClimaAtual, PrevisaoHoraria } from '../services/clima.service';
import { DescricaoClimaPipe } from '../pipes/descricao-clima.pipe';

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
  // ✅ Otimização 1: OnPush — só re-renderiza quando Input/evento mudar
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
    IonButtons, IonBackButton, IonButton, IonCard, IonCardContent, IonCardHeader,
    IonCardTitle, IonLabel, IonItem, IonList, IonBadge, IonSpinner,
    IonGrid, IonRow, IonCol,
    DescricaoClimaPipe, DecimalPipe, DatePipe,
  ],
  providers: [DecimalPipe, DatePipe],
})
export class DetalhesPage implements OnInit {
  // Coordenadas padrão: Recife, PE
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
      this.carregarClimaAtual();
      this.carregarPrevisaoHoraria();
    });
  }

  carregarClimaAtual() {
    this.carregandoAtual = true;
    this.climaService.getClimaAtual(this.lat, this.lon).subscribe({
      next: (data) => {
        this.climaAtual = data;
        this.carregandoAtual = false;
        this.cdr.markForCheck(); // ✅ notifica OnPush
      },
      error: () => {
        this.erroAtual = 'Falha ao carregar clima atual.';
        this.carregandoAtual = false;
        this.cdr.markForCheck();
      },
    });
  }

  carregarPrevisaoHoraria() {
    this.carregandoHorario = true;
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
        this.cdr.markForCheck(); // ✅ notifica OnPush
      },
      error: () => {
        this.erroHorario = 'Falha ao carregar previsão horária.';
        this.carregandoHorario = false;
        this.cdr.markForCheck();
      },
    });
  }

  // ✅ Otimização 2: trackBy evita re-renderização do DOM no ngFor
  atualizarTodas() {
    this.climaService.limparCache();
    this.carregarClimaAtual();
    this.carregarPrevisaoHoraria();
  }

  trackByHora(index: number, i: number): number {
    return i;
  }
}
