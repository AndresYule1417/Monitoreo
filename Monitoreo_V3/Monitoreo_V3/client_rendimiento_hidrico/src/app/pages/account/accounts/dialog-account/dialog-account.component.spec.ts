import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAccountComponent } from './dialog-account.component';

describe('DialogAccountComponent', () => {
  let component: DialogAccountComponent;
  let fixture: ComponentFixture<DialogAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
