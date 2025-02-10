import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef } from '@angular/core';
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
export class EmployeeChatbotComponent implements AfterViewInit, OnInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  readonly MessageCircle = MessageCircle;
  readonly Send = Send;
  messages: any[] = [];
  threads: any[] = [];
  selectedThreadId: number | null = null;
  input = '';
  isUploading = false;
  isThinking = false;
  isLoadingMessages = false;
  isLoadingThreads = false;

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchThreads();
  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  fetchThreads() {
    this.isLoadingThreads = true; // Show loading indicator
    this.cdRef.detectChanges();  // Ensure UI updates
  
    this.http.get<any[]>('http://127.0.0.1:8000/threads').subscribe(
      (res) => {
        this.threads = res;
        this.isLoadingThreads = false; // Hide loading indicator
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error fetching threads:', error);
        this.isLoadingThreads = false; // Hide loading indicator
        this.cdRef.detectChanges();
      }
    );
  }

  selectThread(threadId: number) {
    this.selectedThreadId = threadId;
    this.messages = []; // Clear previous messages
    this.isLoadingMessages = true;
    this.fetchMessages(threadId);
  }

  fetchMessages(threadId: number) {
    this.http.get<any[]>(`http://127.0.0.1:8000/threads/${threadId}/messages`).subscribe(
      (res) => {
        this.messages = res;
        this.isLoadingMessages = false;
        this.scrollToBottom();
      },
      (error) => {
        this.isLoadingMessages = false;
        console.error('Error fetching messages:', error);
      }
    );
  }

  createNewThread() {
    this.http.post<{ id: number; title: string }>('http://127.0.0.1:8000/thread/create', { title: 'New Thread' }).subscribe(
      (res) => {
        this.threads.push(res); // Add new thread to list
        this.selectedThreadId = res.id; // Auto-select new thread
        this.messages = []; // Clear messages
        this.cdRef.detectChanges(); // Ensure UI updates
      },
      (error) => {
        console.error('Error creating new thread:', error);
      }
    );
  }

  sendMessage() {
    if (this.input.trim()) {
      const userMessage = {
        type: 'user',
        text: this.input.trim(),
        timestamp: this.getCurrentTime(),
      };
      this.messages.push(userMessage);
      this.input = '';
      this.isThinking = true;
      this.scrollToBottom();
      this.cdRef.detectChanges();

      const payload: any = { message: userMessage.text };
      if (this.selectedThreadId) {
        payload.thread_id = this.selectedThreadId;
      }

      this.http.post<{ response: string; text:string; ai_response:string ;thread_id: number, thread_title: string, is_new_thread: boolean }>('http://127.0.0.1:8000/chat', payload).subscribe(
        (res) => {
          this.selectedThreadId = res.thread_id; // Ensure thread is selected
          const aiMessage = {
            id: 1000,
            type: 'ai',
            text: res.text,
            ai_response : res.ai_response,
            timestamp: this.getCurrentTime(),
          };

          console.log(aiMessage);
          const thread = {
            id: res.thread_id,
            title: res.thread_title
          }
          this.messages.push(aiMessage);

          if(res.is_new_thread)
            this.threads.push(thread)

          this.isThinking = false;
          this.cdRef.detectChanges();
          this.scrollToBottom();
        },
        (error) => {
          this.isThinking = false;
          console.error('Error fetching bot response:', error);
          this.messages.push({
            type: 'ai',
            text: 'Sorry, I am unable to process your request at the moment.',
            timestamp: this.getCurrentTime(),
          });
          this.cdRef.detectChanges();
          this.scrollToBottom();
        }
      );
    }
    this.cdRef.detectChanges();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  getCurrentTime(): string {
    const now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
  }
}
