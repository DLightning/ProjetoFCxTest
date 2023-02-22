import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'WebAppUI';

  constructor(private router: Router, private auth: AuthService) {   }

  signoff(){
    return this.auth.logoff()
  }

  isLogged(): boolean{
    return this.auth.isLoggedIn();
  }
}
