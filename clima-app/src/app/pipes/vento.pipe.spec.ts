import { TestBed } from '@angular/core/testing';
import { VentoPipe } from './vento.pipe';
import { ConfiguracoesService } from '../services/configuracoes.service';

describe('VentoPipe', () => {
  let pipe: VentoPipe;
  let configService: ConfiguracoesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    configService = TestBed.inject(ConfiguracoesService);
    pipe = TestBed.runInInjectionContext(() => new VentoPipe());
  });

  it('deve converter velocidade do vento de acordo com a configuracao ativa', () => {
    expect(pipe.transform(50)).toBe(50);

    configService.setUnidadeVento('mph');
    expect(pipe.transform(50)).toBeCloseTo(31.0685, 2);
  });
});
