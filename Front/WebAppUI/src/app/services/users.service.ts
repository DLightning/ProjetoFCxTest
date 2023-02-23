import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { User } from '../models/user.model';
import { UserDTO } from '../models/userDTO.models';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseApiUrl: string = environment.baseApiUrl;
  constructor(private http: HttpClient) { }
  
  getAllUsers(): Observable<User[]>{
    return this.http.get<User[]>(this.baseApiUrl + '/api/Users')
  }

  addUser(userRequest: UserDTO): Observable<User>{
    console.log(userRequest)
    return this.http.post<User>(this.baseApiUrl + '/api/Users', userRequest, {headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })})
  }

  getUserById(id: string): Observable<User>{
    return this.http.get<User>(this.baseApiUrl + '/api/Users/' + id);
  }

  updateUser(id: string, userObj: User): Observable<User>{
    
    return this.http.put<User>(this.baseApiUrl + '/api/Users/' + id, userObj);
  }

  search(search: string): Observable<User[]>{
    const url = `?search=${search}`
    return this.http.get<User[]>(this.baseApiUrl + '/api/Users/search'+ url);
  }

  resetPassword(email: string, password: string): Observable<User>{
    const url = `?email=${email}&password=${password}`
    return this.http.put<User>(this.baseApiUrl + '/api/Users/reset' + url, email);
  }

  getUsersByAgeRange(minAge: number, maxAge: number): Observable<User[]>{
    const url = `?minAge=${minAge}&maxAge=${maxAge}`;
    return this.http.get<User[]>(this.baseApiUrl + '/api/Users/age-range'+ url);
  }

  getUsersbyStatus(status: string): Observable<User[]>{
    const url = `?status=${status}`
    return this.http.get<User[]>(this.baseApiUrl + '/api/Users/status'+ url);
  }

  deleteUser(id: string): Observable<User>{
    return this.http.put<User>(this.baseApiUrl + '/api/Users/delete' + id, id);
  }

  changeStatus(id: string, status: number): Observable<User>{
    const url = `${id}?status=${status}`
    return this.http.put<User>(this.baseApiUrl + '/api/Users/changeStatus' + url, url);
  }
}
