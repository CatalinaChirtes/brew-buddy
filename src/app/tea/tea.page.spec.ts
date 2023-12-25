import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeaPage } from './tea.page';

describe('TeaPage', () => {
  let component: TeaPage;
  let fixture: ComponentFixture<TeaPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(TeaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
