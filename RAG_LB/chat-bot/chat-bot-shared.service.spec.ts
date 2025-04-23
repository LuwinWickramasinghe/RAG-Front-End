import { TestBed } from '@angular/core/testing';

import { ChatBotSharedService } from './chat-bot-shared.service';

describe('ChatBotSharedService', () => {
  let service: ChatBotSharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatBotSharedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
