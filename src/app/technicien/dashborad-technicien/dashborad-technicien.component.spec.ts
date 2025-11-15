import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboradTechnicienComponent } from './dashborad-technicien.component';

describe('DashboradTechnicienComponent', () => {
  let component: DashboradTechnicienComponent;
  let fixture: ComponentFixture<DashboradTechnicienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboradTechnicienComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboradTechnicienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
