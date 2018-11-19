import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreePlayersComponent } from './three-players.component';

describe('ThreePlayersComponent', () => {
  let component: ThreePlayersComponent;
  let fixture: ComponentFixture<ThreePlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreePlayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreePlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
