import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Americas } from './americas';

describe('Americas', () => {
  let component: Americas;
  let fixture: ComponentFixture<Americas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Americas],
    }).compileComponents();

    fixture = TestBed.createComponent(Americas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
