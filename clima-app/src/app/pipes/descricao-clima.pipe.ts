import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe PERSONALIZADA 1 — DescricaoClima
 * Converte o WMO weather code em texto descritivo em português.
 * Uso: {{ weatherCode | descricaoClima }}
 */
@Pipe({
  name: 'descricaoClima',
  standalone: true,
})
export class DescricaoClimaPipe implements PipeTransform {
  private readonly descricoes: Record<number, string> = {
    0: 'Céu limpo ☀️',
    1: 'Predominantemente limpo 🌤️',
    2: 'Parcialmente nublado ⛅',
    3: 'Nublado ☁️',
    45: 'Névoa 🌫️',
    48: 'Névoa com gelo 🌫️❄️',
    51: 'Garoa leve 🌦️',
    53: 'Garoa moderada 🌦️',
    55: 'Garoa densa 🌧️',
    61: 'Chuva leve 🌧️',
    63: 'Chuva moderada 🌧️',
    65: 'Chuva forte 🌧️',
    71: 'Neve leve 🌨️',
    73: 'Neve moderada 🌨️',
    75: 'Neve forte 🌨️',
    77: 'Granizo 🌨️',
    80: 'Pancada de chuva leve 🌦️',
    81: 'Pancada de chuva moderada 🌧️',
    82: 'Pancada de chuva forte ⛈️',
    85: 'Pancadas de neve 🌨️',
    86: 'Pancadas de neve fortes 🌨️',
    95: 'Tempestade ⛈️',
    96: 'Tempestade com granizo ⛈️🌩️',
    99: 'Tempestade forte com granizo ⛈️🌩️',
  };

  transform(code: number | null | undefined): string {
    if (code == null) return 'Sem dados';
    return this.descricoes[code] ?? `Código ${code}`;
  }
}
