import { DatePipe, formatDate } from '@angular/common';
import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserDTO } from 'src/app/models/userDTO.models';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit{

  addUserDetail: UserDTO = {
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
  constructor(private route: ActivatedRoute, private userService: UsersService, private router: Router){}
  
  ngOnInit(): void{}


  addUser(){
    this.addUserDetail.birthDate = this.formatarData(this.addUserDetail.birthDate)
    this.userService.addUser(this.addUserDetail)
    .subscribe({
      next:(response) =>{
        console.log(response)
        this.router.navigate(['usersList']);
        
      },
      error:(response) => {
        console.log(response);
      }
    })
  }
  
  formatarData(data: string){
    let partes = data.split("/");
    let novaData = partes[2] + "-" + partes[1] + "-" + partes[0];
    return novaData;
  }
}
