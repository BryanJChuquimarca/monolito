import { Component } from '@angular/core';
import { RestApiServiceService } from '../../services/rest-api.service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profile: {
    message: string,
    user: {
      id: number;
      username: string;
      role: string;
      iat: number;
      exp: number;
    }
  } | null = null;

  constructor(private restApiService: RestApiServiceService) { }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.restApiService.getProfile().subscribe((data) => {
      this.profile = data;
    });
  }

}
