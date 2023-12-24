import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SphereGeoComponent } from './sphere-geo.component';

describe('SphereGeoComponent', () => {
  let component: SphereGeoComponent;
  let fixture: ComponentFixture<SphereGeoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SphereGeoComponent]
    });
    fixture = TestBed.createComponent(SphereGeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
