import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private baseUrl: string = environment.baseApiUrl;
  constructor(private http: HttpClient, private router: Router) {   }

  login(loginObj: any){
    return this.http.post<any>(`${this.baseUrl}/api/Users/authenticate`, loginObj)
  }

  logoff(){
    localStorage.clear();
    this.router.navigate([''])
  }
  
  storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue)
  }

  getToken(){
    return localStorage.getItem('token')
  }

  isLoggedIn(): boolean{
    return !!localStorage.getItem('token')
  }

  
}
