import { Component, Input, OnInit } from '@angular/core';
import { ChatBotSharedService } from '../chat-bot-shared.service';
import { map } from 'rxjs';
import { TypeWriterService } from '../type-writer.service';

@Component({
  selector: 'app-floating-button',
  templateUrl: './floating-button.component.html',
  styleUrls: ['./floating-button.component.scss']
})
export class FloatingButtonComponent implements OnInit {

  constructor(private sharedService: ChatBotSharedService, private typeWriterService: TypeWriterService) { }

  @Input() pageFloat!: string;
  @Input() greetFloat!: string;

  title = 'RAG_LB';

  showChat = false;
  showTextBox = true;

  titles = ['👋 Meet Leo! Tap here for quick assistance.'];

  typedText$ = this.typeWriterService
    .getTypewriterEffect(this.titles)
    .pipe(map((text) => text));

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
