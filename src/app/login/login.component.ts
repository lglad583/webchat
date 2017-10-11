
import { Component } from '@angular/core';
import { Router } from '@angular/router';


import { ChatService } from '../chat.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers : [ChatService,HttpService]
})
export class LoginComponent{

  public username = null;
  public email = null;
  public password = null;
  public templateRef:any;
  public isuserNameAvailable = false;
  public userTypingTimeout= 500;
  public typingTimer = null;

  constructor(
    private chatService : ChatService,
    private router :Router
  ){ }

  public login():void{

    if(this.username === '' ) {
      alert(`Username can't be empty.`);
    }else if(this.password === ''){
      alert(`Password can't be empty.`);
    }else{
      this.chatService.login({
        'username' : this.username,
        'password' : this.password,
      },(error , result)=>{
        if(error) {
          alert(result);
        }else{
          if(!result.error) {
            this.router.navigate(['/home/'+result.userId]);
          }else{
            alert(`Invalid Credentials`);
          }
        }
      });
    }
  }

  public registerUser():void{

    if(this.username === '') {
      alert(`Username can't be empty.`);
    }else if(this.email === ''){
      alert(`Email can't be empty.`);
    }else if(this.password === ''){
      alert(`Password can't be empty.`);
    }else{
      this.chatService.registerUser({
        username : this.username,
        email : this.email,
        password : this.password
      },(error , result)=>{
        if(error) {
          alert(result);
        }else{
          if(!result.error) {
            this.router.navigate(['/home/'+result.userId]);
          }else{
            alert(`Registration failure.`);
          }
        }
      });
    }
  }

}
