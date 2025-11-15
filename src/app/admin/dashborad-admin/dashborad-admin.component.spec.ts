import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboradAdminComponent } from './dashborad-admin.component';

describe('DashboradAdminComponent', () => {
  let component: DashboradAdminComponent;
  let fixture: ComponentFixture<DashboradAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboradAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboradAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
