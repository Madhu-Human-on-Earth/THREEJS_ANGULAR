import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TorusKComponent } from './torus-k.component';

describe('TorusKComponent', () => {
  let component: TorusKComponent;
  let fixture: ComponentFixture<TorusKComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TorusKComponent]
    });
    fixture = TestBed.createComponent(TorusKComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
