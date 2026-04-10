import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApiInfo } from './api-info';

describe('ApiInfo', () => {
  let component: ApiInfo;
  let fixture: ComponentFixture<ApiInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApiInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(ApiInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
