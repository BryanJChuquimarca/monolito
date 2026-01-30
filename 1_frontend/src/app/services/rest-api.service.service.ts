import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RestApiServiceService {
  private apiURL = 'http://frontend.localhost/api/';
  private tokenKey = 'authToken';

  isLoggedIn = signal(false);

  constructor(private http: HttpClient) {
    this.logout();
  }

  login(username: string, password: string): Observable<any> {
    const res = this.http.post(this.apiURL + 'auth/login', { username, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem(this.tokenKey, response.token);
        }
      })
    );
    console.log('Login response:', res);
    this.isLoggedIn.set(true);
    return res;
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  //obtener perfil de usuario
  getProfile(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.get(this.apiURL + 'user/profile', { headers });
  }
  //obtener posts
  getPosts(): Observable<any> {
    return this.http.get(this.apiURL + 'public/post');
  }
  //crear un post
  createPost(content: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.post(this.apiURL + 'post', { content }, { headers });
  }
  //eliminar un post
  deletePost(postId: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.delete(this.apiURL + `post/${postId}`, { headers });
  }
  //obtener comentarios de un post
  getComments(postId: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.get(this.apiURL + `comment/${postId}`, { headers });
  }
  //crear un comentario
  createComment(postId: string, content: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.post(this.apiURL + 'comment', { postId, content }, { headers });
  }
  //eliminar un comentario
  deleteComment(commentId: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.delete(this.apiURL + `comment/${commentId}`, { headers });
  }
  //contar los likes de un post
  getLikes(postId: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.get(this.apiURL + `like/${postId}`, { headers });
  }
  //crear un like
  toggleLike(postId: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.post(this.apiURL + 'like/toggle', { postId }, { headers });
  }
  //verificar si me gusta un post
  doILike(postId: number): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
    return this.http.get(this.apiURL + `like/status/${postId}`, { headers });
  }

}