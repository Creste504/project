import { TestBed } from '@angular/core/testing';
import { TemperaturaPipe } from './temperatura.pipe';
import { ConfiguracoesService } from '../services/configuracoes.service';

describe('TemperaturaPipe', () => {
  let pipe: TemperaturaPipe;
  let configService: ConfiguracoesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    configService = TestBed.inject(ConfiguracoesService);
    pipe = TestBed.runInInjectionContext(() => new TemperaturaPipe());
  });

  it('deve converter temperatura de acordo com a configuracao ativa', () => {
    expect(pipe.transform(20)).toBe(20);

    configService.setUnidadeTemperatura('fahrenheit');
    expect(pipe.transform(20)).toBe(68);
  });
});
