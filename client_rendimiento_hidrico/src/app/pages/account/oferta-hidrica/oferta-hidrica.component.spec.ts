import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaHidricaComponent } from './oferta-hidrica.component';

describe('OfertaHidricaComponent', () => {
  let component: OfertaHidricaComponent;
  let fixture: ComponentFixture<OfertaHidricaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfertaHidricaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfertaHidricaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
