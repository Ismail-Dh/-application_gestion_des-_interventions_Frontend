import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboradResponsableComponent } from './dashborad-responsable.component';

describe('DashboradResponsableComponent', () => {
  let component: DashboradResponsableComponent;
  let fixture: ComponentFixture<DashboradResponsableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboradResponsableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboradResponsableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
