import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportResComponent } from './rapport-res.component';

describe('RapportResComponent', () => {
  let component: RapportResComponent;
  let fixture: ComponentFixture<RapportResComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapportResComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportResComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
