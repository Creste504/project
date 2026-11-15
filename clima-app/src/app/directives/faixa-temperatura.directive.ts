import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

/**
 * Diretiva PERSONALIZADA 1 — appFaixaTemperatura
 * Aplica estilização dinâmica (cor de destaque, fundo suave e borda lateral)
 * de acordo com a faixa de temperatura em graus Celsius.
 *
 * Uso: <p [appFaixaTemperatura]="temperatura">...</p>
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
    this.renderer.setStyle(elemento, 'border-radius', '6px');
    this.renderer.setStyle(elemento, 'transition', 'all 0.25s ease');
    this.renderer.setStyle(elemento, 'display', 'inline-block');

    if (this.temperatura == null || Number.isNaN(this.temperatura)) {
      this.renderer.removeStyle(elemento, 'border-left');
      this.renderer.removeStyle(elemento, 'background-color');
      this.renderer.removeStyle(elemento, 'color');
      return;
    }

    if (this.temperatura < 16) {
      // Frio — tons de azul
      this.renderer.setStyle(elemento, 'border-left', '4px solid #0288d1');
      this.renderer.setStyle(elemento, 'background-color', 'rgba(2, 136, 209, 0.12)');
      this.renderer.setStyle(elemento, 'color', '#01579b');
    } else if (this.temperatura <= 26) {
      // Agradável / Ameno — tons de verde
      this.renderer.setStyle(elemento, 'border-left', '4px solid #2e7d32');
      this.renderer.setStyle(elemento, 'background-color', 'rgba(46, 125, 50, 0.12)');
      this.renderer.setStyle(elemento, 'color', '#1b5e20');
    } else if (this.temperatura <= 31) {
      // Quente — tons de laranja
      this.renderer.setStyle(elemento, 'border-left', '4px solid #ef6c00');
      this.renderer.setStyle(elemento, 'background-color', 'rgba(239, 108, 0, 0.14)');
      this.renderer.setStyle(elemento, 'color', '#e65100');
    } else {
      // Muito quente — tons de vermelho
      this.renderer.setStyle(elemento, 'border-left', '4px solid #c62828');
      this.renderer.setStyle(elemento, 'background-color', 'rgba(198, 40, 40, 0.15)');
      this.renderer.setStyle(elemento, 'color', '#b71c1c');
    }
  }
}
