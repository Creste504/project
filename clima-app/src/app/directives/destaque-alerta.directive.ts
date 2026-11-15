import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

/**
 * Diretiva PERSONALIZADA 2 — appDestaqueAlerta
 * Estiliza visualmente itens/cards conforme o estado de alerta meteorológico
 * e adiciona interatividade visual (efeito de elevação e realce ao passar o mouse).
 *
 * Uso: <ion-item [appDestaqueAlerta]="temAlerta(i)">...</ion-item>
 */
@Directive({
  selector: '[appDestaqueAlerta]',
  standalone: true,
})
export class DestaqueAlertaDirective implements OnInit, OnChanges {
  @Input('appDestaqueAlerta') emAlerta = false;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.configurarTransicaoBase();
    this.atualizarEstiloAlerta();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('emAlerta' in changes) {
      this.atualizarEstiloAlerta();
    }
  }

  private configurarTransicaoBase(): void {
    const elemento = this.el.nativeElement;
    this.renderer.setStyle(
      elemento,
      'transition',
      'transform 0.2s ease, box-shadow 0.2s ease, border-left 0.2s ease'
    );
  }

  private atualizarEstiloAlerta(): void {
    const elemento = this.el.nativeElement;

    if (this.emAlerta) {
      this.renderer.setStyle(elemento, 'border-left', '4px solid var(--ion-color-warning, #ffc409)');
    } else {
      this.renderer.setStyle(elemento, 'border-left', '4px solid var(--ion-color-success, #2dd36f)');
    }
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    const elemento = this.el.nativeElement;
    this.renderer.setStyle(elemento, 'transform', 'translateY(-2px)');
    this.renderer.setStyle(
      elemento,
      'box-shadow',
      this.emAlerta
        ? '0 4px 12px rgba(255, 196, 9, 0.25)'
        : '0 4px 12px rgba(0, 0, 0, 0.12)'
    );
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    const elemento = this.el.nativeElement;
    this.renderer.removeStyle(elemento, 'transform');
    this.renderer.removeStyle(elemento, 'box-shadow');
  }
}
