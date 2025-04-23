import { Component } from '@angular/core';
import { CommonModule, NgIf  } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { EmployeeChatbotComponent } from "./employee-chatbot/employee-chatbot.component";
import { SharedService } from './shared-service';
import { FloatButtonComponent } from './float-button/float-button.component';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, FloatButtonComponent, CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  

}
