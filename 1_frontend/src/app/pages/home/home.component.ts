import { Component, OnInit, signal } from '@angular/core';
import { RestApiServiceService } from '../../services/rest-api.service.service';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonApp, IonContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  standalone: true,

  imports: [ CommonModule, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  protected readonly title = signal('Pagina principal');

  posts: any[] = []

  constructor(private api: RestApiServiceService) { }

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.api.getPosts().subscribe((data) => {
      this.posts = data;
    });
  }
}
