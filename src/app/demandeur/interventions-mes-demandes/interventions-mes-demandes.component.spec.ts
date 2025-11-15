import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterventionsMesDemandesComponent } from './interventions-mes-demandes.component';

describe('InterventionsMesDemandesComponent', () => {
  let component: InterventionsMesDemandesComponent;
  let fixture: ComponentFixture<InterventionsMesDemandesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterventionsMesDemandesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterventionsMesDemandesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
