import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SplashDynamicPage } from './splash-dynamic.page';

describe('SplashDynamicPage', () => {
  let component: SplashDynamicPage;
  let fixture: ComponentFixture<SplashDynamicPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SplashDynamicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
