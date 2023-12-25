import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { TimerPage } from './timer.page';

describe('TimerPage', () => {
  let component: TimerPage;
  let fixture: ComponentFixture<TimerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimerPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TimerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
