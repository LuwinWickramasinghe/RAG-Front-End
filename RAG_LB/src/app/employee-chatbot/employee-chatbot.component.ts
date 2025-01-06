import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-chatbot.component.html',
})
export class EmployeeChatbotComponent {
  messages = [
    {
      id: 1,
      type: 'ai',
      text: 'Welcome to LB Finance Knowledge Assistant. How can I help you today?',
      timestamp: this.getCurrentTime(),
    },
  ];
  input = '';
  isUploading = false;

  // Handles sending the user's message
  sendMessage() {
    if (this.input.trim()) {
      this.messages.push({
        id: this.messages.length + 1,
        type: 'user',
        text: this.input.trim(),
        timestamp: this.getCurrentTime(),
      });
      this.input = '';
      this.simulateBotResponse(); // Optional: Simulate a bot response
    }
  }

  // Simulates a bot response
  simulateBotResponse() {
    setTimeout(() => {
      this.messages.push({
        id: this.messages.length + 1,
        type: 'ai',
        text: 'I am here to assist you. Please tell me more.',
        timestamp: this.getCurrentTime(),
      });
    }, 1500);
  }

  // Handles file upload
  handleFileUpload(event: Event) {
    this.isUploading = true;
    setTimeout(() => {
      this.isUploading = false;
      this.messages.push({
        id: this.messages.length + 1,
        type: 'ai',
        text: 'Your document has been uploaded successfully.',
        timestamp: this.getCurrentTime(),
      });
    }, 2000);
  }

  // Gets the current time in HH:mm AM/PM format
  getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes} ${ampm}`;
  }
}
