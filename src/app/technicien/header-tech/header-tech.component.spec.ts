import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderTechComponent } from './header-tech.component';

describe('HeaderTechComponent', () => {
  let component: HeaderTechComponent;
  let fixture: ComponentFixture<HeaderTechComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderTechComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderTechComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
