import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  RendererStyleFlags2,
  SimpleChanges,
} from '@angular/core';

/**
 * Diretiva PERSONALIZADA 1 — appFaixaTemperatura
 * Aplica estilização dinâmica (borda lateral colorida e fundo suave adaptável a tema claro/escuro)
 * de acordo com a faixa de temperatura em graus Celsius.
 *
 * Uso: <div [appFaixaTemperatura]="temperatura">...</div>
 */
@Directive({
  selector: '[appFaixaTemperatura]',
  standalone: true,
})
export class FaixaTemperaturaDirective implements OnChanges {
  @Input('appFaixaTemperatura') temperatura: number | null | undefined;

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('temperatura' in changes) {
      this.aplicarEstilo();
    }
  }

  private aplicarEstilo(): void {
    const elemento = this.el.nativeElement;

    this.renderer.setStyle(elemento, 'padding', '0.35rem 0.6rem');
    this.renderer.setStyle(elemento, 'border-radius', '8px');
    this.renderer.setStyle(
      elemento,
      'transition',
      'background-color 0.25s ease, border-color 0.25s ease'
    );

    if (this.temperatura == null || Number.isNaN(this.temperatura)) {
      this.renderer.removeStyle(elemento, 'border-left');
      this.renderer.removeStyle(elemento, 'background-color');
      return;
    }

    if (this.temperatura < 16) {
      // Frio — azul
      this.renderer.setStyle(
        elemento,
        'border-left',
        '4px solid #3880ff',
        RendererStyleFlags2.Important
      );
      this.renderer.setStyle(
        elemento,
        'background-color',
        'rgba(56, 128, 255, 0.15)',
        RendererStyleFlags2.Important
      );
    } else if (this.temperatura <= 26) {
      // Agradável / Ameno — verde
      this.renderer.setStyle(
        elemento,
        'border-left',
        '4px solid #2dd36f',
        RendererStyleFlags2.Important
      );
      this.renderer.setStyle(
        elemento,
        'background-color',
        'rgba(45, 211, 111, 0.15)',
        RendererStyleFlags2.Important
      );
    } else if (this.temperatura <= 31) {
      // Quente — laranja/amarelo
      this.renderer.setStyle(
        elemento,
        'border-left',
        '4px solid #ffc409',
        RendererStyleFlags2.Important
      );
      this.renderer.setStyle(
        elemento,
        'background-color',
        'rgba(255, 196, 9, 0.16)',
        RendererStyleFlags2.Important
      );
    } else {
      // Muito quente — vermelho
      this.renderer.setStyle(
        elemento,
        'border-left',
        '4px solid #eb445a',
        RendererStyleFlags2.Important
      );
      this.renderer.setStyle(
        elemento,
        'background-color',
        'rgba(235, 68, 90, 0.16)',
        RendererStyleFlags2.Important
      );
    }
  }
}
