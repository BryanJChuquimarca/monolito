import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RestApiServiceService } from './services/rest-api.service.service';
import { CommonModule } from '@angular/common';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonApp } from '@ionic/angular/standalone';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonApp],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  protected readonly title = signal('Pagina principal');

  posts: any[] = []

  constructor(private api: RestApiServiceService) { }

  ngOnInit() {
    this.loadPost();
  }

  loadPost() {
    this.api.getPosts().subscribe({
      next: (data) => {
        this.posts = data;
        console.log('Posts cargados correctamente:', this.posts);
      },
      error: (err) => {
        console.error('Error al cargar los posts:', err);
      }
    });
  }

}

