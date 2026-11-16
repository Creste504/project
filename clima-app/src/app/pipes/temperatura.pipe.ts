import { Pipe, PipeTransform, inject } from '@angular/core';
import { ConfiguracoesService } from '../services/configuracoes.service';

/**
 * Pipe PERSONALIZADA — Temperatura
 * Converte um valor de temperatura em Celsius para a unidade configurada (°C ou °F).
 * Uso: {{ temperaturaEmCelsius | temperatura }}
 */
@Pipe({
  name: 'temperatura',
  standalone: true,
  pure: false,
})
export class TemperaturaPipe implements PipeTransform {
  private configService = inject(ConfiguracoesService);

  transform(valor: number | null | undefined): number | null {
    return this.configService.converterTemperatura(valor);
  }
}
