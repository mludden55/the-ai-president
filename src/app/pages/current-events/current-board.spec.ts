import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentBoard } from './current-board';

describe('CurrentBoard', () => {
  let component: CurrentBoard;
  let fixture: ComponentFixture<CurrentBoard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentBoard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentBoard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
