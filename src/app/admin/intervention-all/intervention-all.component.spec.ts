import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionAllComponent } from './intervention-all.component';

describe('InterventionAllComponent', () => {
  let component: InterventionAllComponent;
  let fixture: ComponentFixture<InterventionAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterventionAllComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterventionAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
