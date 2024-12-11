import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyTicketFormComponent } from './buy-ticket-form.component';

describe('BuyTicketFormComponent', () => {
  let component: BuyTicketFormComponent;
  let fixture: ComponentFixture<BuyTicketFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyTicketFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyTicketFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
