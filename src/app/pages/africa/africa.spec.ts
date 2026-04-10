import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Africa } from './africa';

describe('Africa', () => {
  let component: Africa;
  let fixture: ComponentFixture<Africa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Africa],
    }).compileComponents();

    fixture = TestBed.createComponent(Africa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
