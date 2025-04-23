import { Component, Input } from '@angular/core';
import { SharedService } from '../shared-service';
import { EmployeeChatbotComponent } from '../employee-chatbot/employee-chatbot.component';
import { ButtonModule } from 'primeng/button';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-float-button',
  imports: [EmployeeChatbotComponent, ButtonModule, NgIf, CommonModule],
  templateUrl: './float-button.component.html',
  styleUrl: './float-button.component.css'
})
export class FloatButtonComponent {
  constructor(private sharedService: SharedService){}

  @Input() page1!: string;
  
  title = 'RAG_LB';

  showChat = false;
  showTextBox = true;

  ngOnInit() {
    setTimeout(() => {
      this.showTextBox = false;
    }, 5000); 


    this.sharedService.showChat$.subscribe(state => {
      this.showChat = state;
    });
    this.sharedService.setShowChat(false);
    
  }
  
  toggleChat() {
    this.sharedService.setShowChat(true);
    this.sharedService.setIsClosed(false);
  }

}
