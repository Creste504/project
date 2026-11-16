import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AlertasPage } from './alertas.page';

describe('AlertasPage', () => {
  let component: AlertasPage;
  let fixture: ComponentFixture<AlertasPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlertasPage],
      providers: [
        provideHttpClient(),
        provideRouter([])
      ]
    });
    fixture = TestBed.createComponent(AlertasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
