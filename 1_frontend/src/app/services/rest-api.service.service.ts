import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestApiServiceService {
  private apiURL = 'http://localhost:1234'
  constructor(private http: HttpClient) { }

  getPosts(){
    return this.http.get<any[]>(`${this.apiURL}/post`);
  }
}
