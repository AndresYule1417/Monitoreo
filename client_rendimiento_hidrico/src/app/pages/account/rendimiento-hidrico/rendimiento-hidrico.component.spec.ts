import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RendimientoHidricoComponent } from './rendimiento-hidrico.component';

describe('RendimientoHidricoComponent', () => {
  let component: RendimientoHidricoComponent;
  let fixture: ComponentFixture<RendimientoHidricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RendimientoHidricoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RendimientoHidricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
