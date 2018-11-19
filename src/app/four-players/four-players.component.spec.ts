import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FourPlayersComponent } from './four-players.component';

describe('FourPlayersComponent', () => {
  let component: FourPlayersComponent;
  let fixture: ComponentFixture<FourPlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FourPlayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FourPlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
