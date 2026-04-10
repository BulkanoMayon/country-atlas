import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Europe } from './europe';

describe('Europe', () => {
  let component: Europe;
  let fixture: ComponentFixture<Europe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Europe],
    }).compileComponents();

    fixture = TestBed.createComponent(Europe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
