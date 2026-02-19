import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowHangingFruitComponent } from './low-hanging-fruit';

describe('LowHangingFruitComponent', () => {
  let component: LowHangingFruitComponent;
  let fixture: ComponentFixture<LowHangingFruitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LowHangingFruitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LowHangingFruitComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
