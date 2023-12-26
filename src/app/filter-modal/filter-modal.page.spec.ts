import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FilterModalPage } from './filter-modal.page';

describe('DiscoverPage', () => {
  let component: FilterModalPage;
  let fixture: ComponentFixture<FilterModalPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FilterModalPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
