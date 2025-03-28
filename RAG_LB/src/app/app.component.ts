import { Component } from '@angular/core';
import { CommonModule, NgIf  } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { EmployeeChatbotComponent } from "./employee-chatbot/employee-chatbot.component";
import { SharedService } from './shared-service';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, EmployeeChatbotComponent, CommonModule, NgIf ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private sharedService: SharedService){}
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
