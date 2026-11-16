import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { CidadesPage } from './cidades.page';

describe('CidadesPage', () => {
  let component: CidadesPage;
  let fixture: ComponentFixture<CidadesPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CidadesPage],
      providers: [
        provideHttpClient(),
        provideRouter([])
      ]
    });
    fixture = TestBed.createComponent(CidadesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
