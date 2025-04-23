import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatBotSharedService {

  constructor() { }

  private showChat = new BehaviorSubject<boolean>(true); // default minimized
  showChat$ = this.showChat.asObservable();

  private isClosed = new BehaviorSubject<boolean>(true); // default minimized
  isClosed$ = this.showChat.asObservable();

  setShowChat(state: boolean) {
    this.showChat.next(state);
  }

  getCurrentState() {
    return this.showChat.value;
  }

  setIsClosed(state: boolean) {
    this.isClosed.next(state);
  }

  getIsClosed() {
    return this.isClosed.value;
  }

}
