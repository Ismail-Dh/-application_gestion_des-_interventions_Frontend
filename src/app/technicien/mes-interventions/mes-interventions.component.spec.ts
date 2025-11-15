import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesInterventionsComponent } from './mes-interventions.component';

describe('MesInterventionsComponent', () => {
  let component: MesInterventionsComponent;
  let fixture: ComponentFixture<MesInterventionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MesInterventionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MesInterventionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
