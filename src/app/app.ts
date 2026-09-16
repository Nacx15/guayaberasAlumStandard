import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { WhatsappButton } from './components/whatsapp-button/whatsapp-button';
import { ToastContainer } from './components/toast-container/toast-container';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, WhatsappButton, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}

