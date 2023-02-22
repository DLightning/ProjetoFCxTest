import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit{

  userDetail: User = {
    id: '',
    email: '',
    name: '',
    password: '',
    username: '',
    cpf: '',
    motherName: '',
    phoneNumber: '',
    birthDate: new Date('01/01/0001'),
    status: 0,
    inclusionDate: new Date('01/01/0001').toISOString(),
    alterationDate: new Date('01/01/0001').toISOString()
  };

  userStatus = [
    {id: 0, name: 'Block'},
    {id: 1, name: 'Inativo'},
    {id: 2, name: 'Ativo'},
  ];
  constructor(private route: ActivatedRoute, private userService: UsersService, private router: Router){}

  ngOnInit(): void {
    this.route.paramMap.subscribe({
      next:(params) =>{
        const id = params.get('id');

        if(id){
          this.userService.getUserById(id).subscribe({
            next:(response)=>{
              this.userDetail = response;
            }
          })
        }
      }
    })
  }
  
  updateUser(){
    console.log(this.userDetail.status)
   
    this.userService.updateUser(this.userDetail.id, this.userDetail).subscribe({
      next:(response) =>{
        this.router.navigate(['usersList']);
      }
    })
  }

  formatData(date: string){
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(date, 'yyyy-MM-dd');
  }
  

  backToList(){
    this.router.navigate(['usersList']);
  }
}
