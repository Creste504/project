import { TestBed } from '@angular/core/testing';
import { ConfiguracoesService } from './configuracoes.service';

describe('ConfiguracoesService', () => {
  let service: ConfiguracoesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfiguracoesService);
  });

  it('deve ser criado com valores padrão (celsius e kmh)', () => {
    expect(service).toBeTruthy();
    expect(service.unidadeTemperatura()).toBe('celsius');
    expect(service.unidadeVento()).toBe('kmh');
    expect(service.simboloTemperatura()).toBe('°C');
    expect(service.simboloVento()).toBe('km/h');
  });

  it('deve converter temperatura de Celsius para Fahrenheit corretamente', () => {
    // 0°C = 32°F
    expect(service.converterTemperatura(0)).toBe(0);
    service.setUnidadeTemperatura('fahrenheit');
    expect(service.unidadeTemperatura()).toBe('fahrenheit');
    expect(service.simboloTemperatura()).toBe('°F');
    expect(service.converterTemperatura(0)).toBe(32);
    // 100°C = 212°F
    expect(service.converterTemperatura(100)).toBe(212);
    // 25°C = 77°F
    expect(service.converterTemperatura(25)).toBe(77);
  });

  it('deve converter velocidade do vento de km/h para mph corretamente', () => {
    expect(service.converterVento(100)).toBe(100);
    service.setUnidadeVento('mph');
    expect(service.unidadeVento()).toBe('mph');
    expect(service.simboloVento()).toBe('mph');
    // 100 km/h ≈ 62.1371 mph
    const convertido = service.converterVento(100);
    expect(convertido).toBeCloseTo(62.1371, 2);
  });

  it('deve retornar null para valores nulos ou indefinidos', () => {
    expect(service.converterTemperatura(null)).toBeNull();
    expect(service.converterTemperatura(undefined)).toBeNull();
    expect(service.converterVento(null)).toBeNull();
    expect(service.converterVento(undefined)).toBeNull();
  });
});
