import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConfiguracoesPage } from './configuracoes.page';
import { ConfiguracoesService } from '../services/configuracoes.service';

describe('ConfiguracoesPage', () => {
  let component: ConfiguracoesPage;
  let fixture: ComponentFixture<ConfiguracoesPage>;
  let configService: ConfiguracoesService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [ConfiguracoesPage],
      providers: [provideRouter([])]
    });
    configService = TestBed.inject(ConfiguracoesService);
    fixture = TestBed.createComponent(ConfiguracoesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve alternar a unidade de temperatura para fahrenheit e persistir', () => {
    component.selecionarTemp('fahrenheit');
    expect(component.unidadeTemperatura).toBe('fahrenheit');
    expect(configService.unidadeTemperatura()).toBe('fahrenheit');
    expect(localStorage.getItem('unidade_temperatura')).toBe('fahrenheit');
  });

  it('deve alternar a unidade de vento para mph e persistir', () => {
    component.selecionarVento('mph');
    expect(component.unidadeVento).toBe('mph');
    expect(configService.unidadeVento()).toBe('mph');
    expect(localStorage.getItem('unidade_vento')).toBe('mph');
  });
});
