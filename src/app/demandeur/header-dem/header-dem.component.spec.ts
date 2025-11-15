import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderDemComponent } from './header-dem.component';

describe('HeaderDemComponent', () => {
  let component: HeaderDemComponent;
  let fixture: ComponentFixture<HeaderDemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderDemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderDemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
