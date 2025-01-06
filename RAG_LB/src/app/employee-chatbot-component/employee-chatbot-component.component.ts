import { Component } from '@angular/core';

@Component({
  selector: 'app-employee-chatbot',
  templateUrl: './employee-chatbot.component.html',
  styleUrls: ['./employee-chatbot.component.css'],
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

  handleFileUpload(event: any) {
    this.isUploading = true;
    setTimeout(() => {
      this.isUploading = false;
    }, 2000); // Simulate file upload
  }

  sendMessage() {
    if (this.input.trim()) {
      this.messages.push({
        id: this.messages.length + 1,
        type: 'user',
        text: this.input,
        timestamp: new Date().toLocaleTimeString(),
      });
      this.input = '';
    }
  }
}
