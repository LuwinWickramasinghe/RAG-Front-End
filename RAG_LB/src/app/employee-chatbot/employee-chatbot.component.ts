import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule, MessageCircle, Send } from 'lucide-angular';

@Component({
  selector: 'app-employee-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './employee-chatbot.component.html',
})
export class EmployeeChatbotComponent {
  readonly MessageCircle = MessageCircle;
  readonly Send = Send;
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
  isThinking = false;

  constructor(private http: HttpClient) {}

  // Handles sending the user's message
  sendMessage() {
    if (this.input.trim()) {
      const userMessage = {
        id: this.messages.length + 1,
        type: 'user',
        text: this.input.trim(),
        timestamp: this.getCurrentTime(),
      };
      this.messages.push(userMessage);
      
      const messageText = this.input.trim();
      this.input = '';
      this.isThinking = true;
      this.fetchBotResponse(messageText);
    }
  }

  // Sends message to backend and fetches bot response
  fetchBotResponse(message: string) {
    this.http.post<{ response: string }>('http://127.0.0.1:8000/chat', { message }).subscribe(
      (res) => {
        this.isThinking = false;
        this.messages.push({
          id: this.messages.length + 1,
          type: 'ai',
          text: res.response,
          timestamp: this.getCurrentTime(),
        });
      },
      (error) => {
        this.isThinking = false;
        console.error('Error fetching bot response:', error);
        this.messages.push({
          id: this.messages.length + 1,
          type: 'ai',
          text: 'Sorry, I am unable to process your request at the moment.',
          timestamp: this.getCurrentTime(),
        });
      }
    );
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
