import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboradDemandeurComponent } from './dashborad-demandeur.component';

describe('DashboradDemandeurComponent', () => {
  let component: DashboradDemandeurComponent;
  let fixture: ComponentFixture<DashboradDemandeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboradDemandeurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboradDemandeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
