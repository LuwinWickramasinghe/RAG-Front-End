import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { LucideAngularModule, MessageCircle, Send, Minimize, Maximize, Trash2, MessageCircleQuestion, X } from 'lucide-angular';
import Swal from 'sweetalert2';
import { SharedService } from '../shared-service';

@Component({
  selector: 'app-employee-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './employee-chatbot.component.html',
  styleUrls: ['./employee-chatbot.component.css']
})
export class EmployeeChatbotComponent implements AfterViewInit, OnInit {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  readonly MessageCircle = MessageCircle;
  readonly Send = Send;
  readonly minimize = Minimize;
  readonly maximize = Maximize;
  readonly trash = Trash2;
  readonly close = X;
  readonly chat = MessageCircleQuestion;
  messages: any[] = [];
  threads: any[] = [];
  selectedThreadId: number | null = null;
  input = '';
  isUploading = false;
  isThinking = false;
  isLoadingMessages = false;
  isLoadingThreads = false;
  isMinimized = true;
  animateChat = false;
  showChat = false; 

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef, private sharedService : SharedService) {}

  @Input() page!: string;

  ngOnInit() {
    this.fetchThreads();

    this.sharedService.showChat$.subscribe(state => {
      this.showChat = state;
    });
    const aiMessage = {
      id: 1000,
      type: 'ai',
      text: '',
      ai_response : "Hi there!",
      timestamp: this.getCurrentTime(),
      page: this.page
    };

    this.messages.push(aiMessage);

  }

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  closeMinimized() {
    this.sharedService.setShowChat(false);
  }

  toggleMinimize() {
    this.isMinimized = !this.isMinimized;

    setTimeout(() => this.scrollToBottom(), 100);
    if (this.isMinimized) {
      this.showChat = false;
    }
  }

  fetchThreads() {
    this.isLoadingThreads = true; // Show loading indicator
    this.cdRef.detectChanges();  // Ensure UI updates
  
    this.http.get<any[]>('http://127.0.0.1:8000/threads').subscribe(
      (res) => {
        this.threads = res;
        this.isLoadingThreads = false; 
        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error fetching threads:', error);
        this.isLoadingThreads = false;
        this.cdRef.detectChanges();
      }
    );
  }

  selectThread(threadId: number) {
    this.selectedThreadId = threadId;
    this.messages = []; 
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
        this.threads.push(res); 
        this.selectedThreadId = res.id; 
        this.messages = [];
        this.cdRef.detectChanges(); 
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

      const payload: any = { message: userMessage.text, page: this.page };
      if (this.selectedThreadId) {
        payload.thread_id = this.selectedThreadId;
      }

      this.http.post<{ response: string; text:string; ai_response:string ;thread_id: number, thread_title: string, is_new_thread: boolean, page: string }>('http://127.0.0.1:8000/chat', payload).subscribe(
        (res) => {
          this.selectedThreadId = res.thread_id; 
          const aiMessage = {
            id: 1000,
            type: 'ai',
            text: res.text,
            ai_response : res.ai_response,
            timestamp: this.getCurrentTime(),
            page: this.page
          };

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
        (error:HttpErrorResponse) => {
          this.isThinking = false;
          console.error('Error fetching bot response:', error.error.detail);
          this.messages.push({
            id:1001,
            type: 'ai',
            text: 'Sorry, I am unable to process your request at the moment.',
            ai_response : error.error.detail,
            timestamp: this.getCurrentTime(),
            page: this.page,
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

  handleEnter(event: KeyboardEvent): void {
    if (this.isThinking) {
      event.preventDefault();
      console.warn('Enter key is disabled.');
    } else {
      this.sendMessage();
    }
  }


  deleteThread(threadId: number, event: Event) {
    event.stopPropagation(); 
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'This thread and all its messages will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const url = `http://127.0.0.1:8000/threads/delete/${threadId}`;
  
        this.http.delete(url).subscribe({
          next: () => {
            this.threads = this.threads.filter(thread => thread.id !== threadId);
    
            if (this.selectedThreadId === threadId) {
              this.selectedThreadId = null;
            }
    
            Swal.fire(
              'Deleted!',
              'The thread has been deleted successfully.',
              'success'
            );
          },
          error: (err) => {
            console.error('Error deleting thread:', err);
            Swal.fire(
              'Error!',
              'Failed to delete the thread. Please try again.',
              'error'
            );
          }
        });
      }
    });
  }
  
  
  
}
