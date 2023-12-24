import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SIGNINComponent } from './signin.component';

describe('SIGNINComponent', () => {
  let component: SIGNINComponent;
  let fixture: ComponentFixture<SIGNINComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SIGNINComponent]
    });
    fixture = TestBed.createComponent(SIGNINComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
