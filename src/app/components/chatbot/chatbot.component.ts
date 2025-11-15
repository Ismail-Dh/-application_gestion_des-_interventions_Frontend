import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chatbot',
  templateUrl:'./chatbot.component.html',
  standalone: true,
  imports: [FormsModule,CommonModule],
  styleUrl:'./chatbot.component.scss',
 
})
export class ChatbotComponent {
  messages: {sender: string, text: string}[] = [
    { sender: 'bot', text: 'Bonjour 👋 Pose-moi une question sur cette application.' }
  ];
  userInput = '';

  constructor(private chatService: ChatService) {}

  send() {
    if (!this.userInput.trim()) return;
    this.messages.push({ sender: 'vous', text: this.userInput });

    this.chatService.ask(this.userInput).subscribe(res => {
      this.messages.push({ sender: 'bot', text: res.answer });
    });

    this.userInput = '';
  }
}
