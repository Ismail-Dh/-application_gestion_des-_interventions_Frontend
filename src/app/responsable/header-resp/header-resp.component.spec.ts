import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderRespComponent } from './header-resp.component';

describe('HeaderRespComponent', () => {
  let component: HeaderRespComponent;
  let fixture: ComponentFixture<HeaderRespComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderRespComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderRespComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
