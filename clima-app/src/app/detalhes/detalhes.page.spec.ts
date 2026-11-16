import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { DetalhesPage } from './detalhes.page';

describe('DetalhesPage', () => {
  let component: DetalhesPage;
  let fixture: ComponentFixture<DetalhesPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DetalhesPage],
      providers: [
        provideHttpClient(),
        provideRouter([])
      ]
    });
    fixture = TestBed.createComponent(DetalhesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
