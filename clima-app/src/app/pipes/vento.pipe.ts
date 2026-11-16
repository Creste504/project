import { Pipe, PipeTransform, inject } from '@angular/core';
import { ConfiguracoesService } from '../services/configuracoes.service';

/**
 * Pipe PERSONALIZADA — Vento
 * Converte a velocidade do vento em km/h para a unidade configurada (km/h ou mph).
 * Uso: {{ ventoEmKmh | vento }}
 */
@Pipe({
  name: 'vento',
  standalone: true,
  pure: false,
})
export class VentoPipe implements PipeTransform {
  private configService = inject(ConfiguracoesService);

  transform(valor: number | null | undefined): number | null {
    return this.configService.converterVento(valor);
  }
}
