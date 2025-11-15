import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilisateursAdminComponent } from './utilisateurs-admin.component';

describe('UtilisateursAdminComponent', () => {
  let component: UtilisateursAdminComponent;
  let fixture: ComponentFixture<UtilisateursAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtilisateursAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtilisateursAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
