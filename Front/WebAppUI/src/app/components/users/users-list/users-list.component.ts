import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { User } from 'src/app/models/user.model';
import { UserDTO } from 'src/app/models/userDTO.models';
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
  UserDetail: UserDTO = {
    id: '',
    email: '',
    name: '',
    password: '',
    username: '',
    cpf: '',
    motherName: '',
    phoneNumber: '',
    status: 0,
    birthDate: new Date('01/01/0001').toDateString()
  };
  
  userStatus = [
    {id: 0, name: 'Block'},
    {id: 1, name: 'Inativo'},
    {id: 2, name: 'Ativo'},
  ];
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
    this.usersService.search(this.searchTerm).subscribe({
      next:(res) =>{
        this.users = res;
      },
      error:(response) => {
        this.toast.error({detail: "ERROR", summary: response.message, duration: 2000})
        this.loadAllUsers();
      }
    })
    
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
            this.toast.error({detail: "ERROR", summary: response.message, duration: 2000})
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
            this.toast.error({detail: "ERROR", summary: response.message, duration: 2000})
          }
        })
      }else{
        this.loadAllUsers();
      }
    }

    changeStatus(id:string, target : any){
      if(target instanceof EventTarget) {
        var elemento = target as HTMLInputElement;
        const status = parseInt(elemento.value);
        this.usersService.changeStatus(id, status).subscribe({
          next:(res) =>{
            this.loadAllUsers();
          },
        })
      }
     
    }
}


     
