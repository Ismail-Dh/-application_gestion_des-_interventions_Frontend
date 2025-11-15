import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionDetailComponent } from './intervention-detail.component';

describe('InterventionDetailComponent', () => {
  let component: InterventionDetailComponent;
  let fixture: ComponentFixture<InterventionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterventionDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterventionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
