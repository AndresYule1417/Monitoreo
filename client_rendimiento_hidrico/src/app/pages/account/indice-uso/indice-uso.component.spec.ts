import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndiceUsoComponent } from './indice-uso.component';

describe('IndiceUsoComponent', () => {
  let component: IndiceUsoComponent;
  let fixture: ComponentFixture<IndiceUsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndiceUsoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndiceUsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
