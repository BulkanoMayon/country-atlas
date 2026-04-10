import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Oceania } from './oceania';

describe('Oceania', () => {
  let component: Oceania;
  let fixture: ComponentFixture<Oceania>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Oceania],
    }).compileComponents();

    fixture = TestBed.createComponent(Oceania);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
