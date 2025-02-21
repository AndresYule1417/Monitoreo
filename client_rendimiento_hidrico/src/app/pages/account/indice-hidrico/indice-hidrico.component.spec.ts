import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiceHidricoComponent } from './indice-hidrico.component';

describe('IndiceHidricoComponent', () => {
  let component: IndiceHidricoComponent;
  let fixture: ComponentFixture<IndiceHidricoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndiceHidricoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndiceHidricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
