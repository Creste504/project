import { Injectable, signal } from '@angular/core';

export type UnidadeTemperatura = 'celsius' | 'fahrenheit';
export type UnidadeVento = 'kmh' | 'mph';

@Injectable({
  providedIn: 'root',
})
export class ConfiguracoesService {
  private readonly CHAVE_TEMP = 'unidade_temperatura';
  private readonly CHAVE_VENTO = 'unidade_vento';

  readonly unidadeTemperatura = signal<UnidadeTemperatura>(this.carregarUnidadeTemp());
  readonly unidadeVento = signal<UnidadeVento>(this.carregarUnidadeVento());

  private carregarUnidadeTemp(): UnidadeTemperatura {
    const salva = localStorage.getItem(this.CHAVE_TEMP);
    if (salva === 'fahrenheit' || salva === 'celsius') {
      return salva;
    }
    return 'celsius';
  }

  private carregarUnidadeVento(): UnidadeVento {
    const salva = localStorage.getItem(this.CHAVE_VENTO);
    if (salva === 'mph' || salva === 'kmh') {
      return salva;
    }
    return 'kmh';
  }

  setUnidadeTemperatura(unidade: UnidadeTemperatura): void {
    this.unidadeTemperatura.set(unidade);
    localStorage.setItem(this.CHAVE_TEMP, unidade);
  }

  setUnidadeVento(unidade: UnidadeVento): void {
    this.unidadeVento.set(unidade);
    localStorage.setItem(this.CHAVE_VENTO, unidade);
  }

  /**
   * Converte valor em Celsius para a unidade configurada (Celsius ou Fahrenheit).
   * Fórmula: °F = (°C × 9/5) + 32
   */
  converterTemperatura(valorCelsius: number | null | undefined): number | null {
    if (valorCelsius == null || Number.isNaN(valorCelsius)) {
      return null;
    }
    if (this.unidadeTemperatura() === 'fahrenheit') {
      return (valorCelsius * 9) / 5 + 32;
    }
    return valorCelsius;
  }

  /**
   * Retorna o símbolo da unidade de temperatura atual (°C ou °F).
   */
  simboloTemperatura(): string {
    return this.unidadeTemperatura() === 'fahrenheit' ? '°F' : '°C';
  }

  /**
   * Converte velocidade do vento de km/h para a unidade configurada (km/h ou mph).
   * 1 km/h ≈ 0.621371 mph
   */
  converterVento(valorKmh: number | null | undefined): number | null {
    if (valorKmh == null || Number.isNaN(valorKmh)) {
      return null;
    }
    if (this.unidadeVento() === 'mph') {
      return valorKmh * 0.621371;
    }
    return valorKmh;
  }

  /**
   * Retorna o símbolo da unidade de vento atual (km/h ou mph).
   */
  simboloVento(): string {
    return this.unidadeVento() === 'mph' ? 'mph' : 'km/h';
  }
}
