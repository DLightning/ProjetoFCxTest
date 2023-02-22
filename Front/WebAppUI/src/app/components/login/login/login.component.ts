import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import ValidateForm from 'src/app/utils/validateForm';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{


    type: string = "password";
    isText: boolean = false;
    eyeIcon: string = "fa-eye-slash";
    loginForm!: FormGroup;
    public resetPasswordEmail!: string;
    public resetPasswordPassword!: string;
    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private toast: NgToastService,  private userService: UsersService){

    }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['',Validators.required],
      password: ['',Validators.required],
    })
  }
  
  hideShowPass(){
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  canActivate(): boolean{
    if(this.auth.isLoggedIn()){
      return true;
    }else{
      this.router.navigate(['login'])
      return false;
    }
  }


   onLogin(){
    if(this.loginForm.valid){
      console.log(this.loginForm.value)
      // send the obj to database
      this.auth.login(this.loginForm.value).subscribe({
        next:(res)=>{
          this.auth.storeToken(res.token)
          this.toast.success({detail: "SUCCESS", summary: res.message, duration: 5000})
          this.loginForm.reset();
          this.router.navigate(['usersList'])
        },
        error:(err)=>{
          this.toast.error({detail: "ERROR", summary: err.message, duration: 5000})
      }})

    }else{
      //throw the erro using toaster and with rewuired fields
      ValidateForm.validateAllFormFields(this.loginForm);
     
    }
   }

   confirmToSend(){
    console.log(this.resetPasswordEmail, this.resetPasswordPassword)
    const buttonRef = document.getElementById("closebtn");
    
    this.userService.resetPassword(this.resetPasswordEmail, this.resetPasswordPassword).subscribe({
      next:(res)=>{
        buttonRef?.click();
      }
    })
    
   }


  }

