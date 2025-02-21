import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCrudComponent } from './dialog-crud.component';

describe('DialogCrudComponent', () => {
  let component: DialogCrudComponent;
  let fixture: ComponentFixture<DialogCrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogCrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
