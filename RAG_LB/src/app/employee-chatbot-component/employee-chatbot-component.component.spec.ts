import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeChatbotComponentComponent } from './employee-chatbot-component.component';

describe('EmployeeChatbotComponentComponent', () => {
  let component: EmployeeChatbotComponentComponent;
  let fixture: ComponentFixture<EmployeeChatbotComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeChatbotComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeChatbotComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
