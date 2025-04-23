import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MessageCircle, Send, Minimize, Maximize, Trash2, MessageCircleQuestion, X } from 'lucide-angular';
import { ChatBotSharedService } from '../chat-bot-shared.service';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent implements OnInit {
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
  input = '';
  isUploading = false;
  isThinking = false;
  isLoadingMessages = false;
  isLoadingThreads = false;
  isMinimized = true;
  animateChat = false;
  showChat = false;
  ratesSuggestion: string[] = ['what would be the total at maturity if i deposit', 'give me exchange rate of'];
  dirSuggestion: string[] = ['I need information of', 'find me details of', 'he\'s working at'];

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef, private sharedService: ChatBotSharedService) { }

  @Input() page!: string;
  @Input() greet!: string;

  ngOnInit() {
    this.sharedService.showChat$.subscribe(state => {
      this.showChat = state;
    });
    const aiMessage = {
      id: 1000,
      type: 'ai',
      text: '',
      ai_response: this.greet,
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

      this.http.post<{ response: string; text: string; ai_response: string; page: string }>('http://127.0.0.1:8000/chat', payload).subscribe(
        (res) => {
          const aiMessage = {
            id: 1000,
            type: 'ai',
            text: res.text,
            ai_response: res.ai_response,
            timestamp: this.getCurrentTime(),
            page: this.page
          };

          this.messages.push(aiMessage);

          this.isThinking = false;
          this.cdRef.detectChanges();
          this.scrollToBottom();
        },
        (error: HttpErrorResponse) => {
          this.isThinking = false;
          console.error('Error fetching bot response:', error.error.detail);
          this.messages.push({
            id: 1001,
            type: 'ai',
            text: 'Sorry, I am unable to process your request at the moment.',
            ai_response: error.error.detail,
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

  resetChat() {
    this.messages.splice(1);
    this.cdRef.detectChanges();

    const uniqueId = 8; 

    this.http.delete(`http://127.0.0.1:8000/cache?unique_id=${uniqueId}`)
      .subscribe({
        next: (response) => {
          console.log('Chat reset successfully:', response);
        },
        error: (error) => {
          console.error('Error resetting chat:', error);
        }
      });
  }

  selectSuggestionRates(ratesSuggestion: string) {
    this.input = ratesSuggestion;
  }

  selectSuggestionDir(dirSuggestion: string) {
    this.input = dirSuggestion;
  }
}