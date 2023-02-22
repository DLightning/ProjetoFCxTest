import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit{

  users: User[] = [];
  pag: number = 1 ;
  contador: number = 10;
  searchTerm: string = '';
  selectedAgeRange: string = '';
  selectedStatus: string = '';

  constructor (private usersService: UsersService, private auth: AuthService, private router: Router, private toast: NgToastService) {}

  ngOnInit(): void{
    this.loadAllUsers();
    
  }
  
  editUser(id: string){
    console.log(`Editar usuário com ID ${id}`);
  }

  logout(){
    this.auth.logoff();
  }

  delete_User(id: string){
    this.usersService.deleteUser(id).subscribe({
      next:(response) =>{
        this.router.navigate(['usersList']);
        location.reload();
      }
    })
  }
  
  search(){
    
  }

  loadAllUsers() {
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error:(response) => {
        console.log(response);
      }
    });
  }
  
    onAgeRangeChange(){
      console.log(this.selectedAgeRange)
      if(this.selectedAgeRange != null && this.selectedAgeRange != ''){
        var string = this.selectedAgeRange.split("-");
        var min = parseInt(string[0].toString());
        var max = parseInt(string[1].toString());
        this.usersService.getUsersByAgeRange(min, max).subscribe({
          next:(res) =>{
            this.users = res;
          },
          error:(response) => {
            this.toast.error({detail: "ERROR", summary: response.message, duration: 5000})
          }
        })
      }else{
        this.loadAllUsers();
      }
    }

    onStatusChange(){
      this.selectedStatus
      if(this.selectedStatus != null && this.selectedStatus != ''){
        this.usersService.getUsersbyStatus(this.selectedStatus).subscribe({
          next:(res) =>{
            this.users = res;
          },
          error:(response) => {
            this.toast.error({detail: "ERROR", summary: response.message, duration: 5000})
          }
        })
      }else{
        this.loadAllUsers();
      }
    }

}


     
