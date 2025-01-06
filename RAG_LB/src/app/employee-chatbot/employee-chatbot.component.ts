import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-chatbot.component.html',
  styleUrls: ['./employee-chatbot.component.css']
})

export class EmployeeChatbotComponent {
  messages = [
    {
      id: 1,
      type: 'ai',
      text: 'Welcome to LB Finance Knowledge Assistant. How can I help you today?',
      timestamp: '10:45 AM',
    },
  ];
  input = '';
  isUploading = false;

  handleFileUpload(event: Event) {
    this.isUploading = true;
    setTimeout(() => {
      this.isUploading = false;
    }, 2000);
  }
}
