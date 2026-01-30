import { Component, Input } from '@angular/core';
import { RestApiServiceService } from '../../services/rest-api.service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-likes-number',
  imports: [CommonModule],
  templateUrl: './likes-number.component.html',
  styleUrl: './likes-number.component.css'
})
export class LikesNumberComponent {
  @Input() postId!: number;
  likesNumber: number = 0;
  liked: boolean = false;
  constructor(private api: RestApiServiceService) { }

  ngOnInit() {
    this.loadLikesnumber();
    this.doIlike();
  }

  loadLikesnumber() {
    this.api.getLikes(this.postId).subscribe((data) => {
      console.log('likes data', data);
      this.likesNumber = data.likeCount;

    });
  }

  toggleLike() {
    this.api.toggleLike(this.postId).subscribe((response) => {
      console.log('toggle like', response);
      this.liked = !this.liked;
      this.loadLikesnumber();
    }, (error) => {
      console.error('Error toggling like:', error);
    });
  }

  doIlike() {
    this.api.doILike(this.postId).subscribe((data) => {
      console.log('do i like data', data);
      this.liked = data.liked;
    }, (error => {
      console.error('Error checking like status:', error);
    })
    );
  }
}