import { Component } from '@angular/core';
import { RestApiServiceService } from '../../services/rest-api.service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMsg: string = '';
  constructor(private RestApiServiceService: RestApiServiceService, private router: Router) { }

  async onLogin() {
    try {
      const result = await firstValueFrom(this.RestApiServiceService.login(this.username, this.password))
      console.log('Login successful:', result);
      this.router.navigate(['/profile']);
    } catch (error) {
      console.error('Login failed:', error);
      this.errorMsg = 'Login failed. Please check your credentials.';
    }
  }

}
