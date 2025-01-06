import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeChatbotComponent } from './employee-chatbot.component';

describe('EmployeeChatbotComponent', () => {
  let component: EmployeeChatbotComponent;
  let fixture: ComponentFixture<EmployeeChatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeChatbotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
