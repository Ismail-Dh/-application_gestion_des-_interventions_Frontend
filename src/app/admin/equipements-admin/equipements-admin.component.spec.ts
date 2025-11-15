import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipementsAdminComponent } from './equipements-admin.component';

describe('EquipementsAdminComponent', () => {
  let component: EquipementsAdminComponent;
  let fixture: ComponentFixture<EquipementsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipementsAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipementsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
