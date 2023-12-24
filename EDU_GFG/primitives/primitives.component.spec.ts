import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimitivesComponent } from './primitives.component';

describe('PrimitivesComponent', () => {
  let component: PrimitivesComponent;
  let fixture: ComponentFixture<PrimitivesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrimitivesComponent]
    });
    fixture = TestBed.createComponent(PrimitivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
