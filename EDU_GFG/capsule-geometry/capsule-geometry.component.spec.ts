import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapsuleGeometryComponent } from './capsule-geometry.component';

describe('CapsuleGeometryComponent', () => {
  let component: CapsuleGeometryComponent;
  let fixture: ComponentFixture<CapsuleGeometryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CapsuleGeometryComponent]
    });
    fixture = TestBed.createComponent(CapsuleGeometryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
