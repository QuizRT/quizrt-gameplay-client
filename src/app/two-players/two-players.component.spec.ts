import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoPlayersComponent } from './two-players.component';

describe('TwoPlayersComponent', () => {
  let component: TwoPlayersComponent;
  let fixture: ComponentFixture<TwoPlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoPlayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
