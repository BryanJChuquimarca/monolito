import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RestApiServiceService } from './services/rest-api.service.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  readonly title = signal('frontend');
  protected readonly auth = inject(RestApiServiceService);
  protected readonly router = inject(Router)
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
