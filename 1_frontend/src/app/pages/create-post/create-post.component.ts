import { Component } from '@angular/core';
import { RestApiServiceService } from '../../services/rest-api.service.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-create-post',
  imports: [CommonModule, FormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent {
  constructor(private api: RestApiServiceService, private router: Router) {
  }
  content: string = '';
  createPost() {
    this.api.createPost(this.content).subscribe((response) => {
      console.log('Post created: ', response);
      this.content = '';
      if (response.id) {
        this.router.navigate(['/'], response.id);
      } else {
        console.log('Error creating post')
      }
    });
  }
}