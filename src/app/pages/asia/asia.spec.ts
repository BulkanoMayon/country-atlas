import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Asia } from './asia';

describe('Asia', () => {
  let component: Asia;
  let fixture: ComponentFixture<Asia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Asia],
    }).compileComponents();

    fixture = TestBed.createComponent(Asia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
