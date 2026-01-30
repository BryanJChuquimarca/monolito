import { Component, inject, OnInit } from '@angular/core';
import { RestApiServiceService } from '../../services/rest-api.service.service';
import { CommonModule } from '@angular/common';
import { LikesNumberComponent } from '../../components/likes-number/likes-number.component';
import { CommentsComponent } from '../../components/comments/comments.component';

@Component({
  selector: 'app-home',
  standalone: true,

  imports: [CommonModule, LikesNumberComponent, CommentsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  posts: any[] = []
  protected readonly auth = inject(RestApiServiceService);
  commentsVisibles: { [postId: string]: boolean } = {};

  constructor(private api: RestApiServiceService) { }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.api.getPosts().subscribe((data) => {
      this.posts = data;
    });
  }

  deletePost(postId: string) {
    this.api.deletePost(postId).subscribe(() => {
      console.log(`Post with ID ${postId} deleted.`);
      this.loadPosts();
    });
  }
  toggleComments(postId: string) {
    this.commentsVisibles[postId] = !this.commentsVisibles[postId];
  }
}
