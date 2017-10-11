
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute ,Router } from '@angular/router';


/* Importing services starts*/
import { SocketService } from '../socket.service';
import { HttpService } from '../http.service';
import { ChatService } from '../chat.service';
/* Importing services ends*/

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers : [ChatService,HttpService,SocketService]
})
export class HomeComponent implements OnInit {

  /*
    * UI related variables starts
    */
  public overlayDisplay = false;
  /*
    * UI related variables ends
    */

  /*
    * Chat and message related variables starts
    */
  public username = null;
  public userId = null;
  public chatListUsers: any;
  public selectedUserId: any;
  public selectedSocketId: any;
  public selectedUserName: any;
  public messages: any =[];
  public message: string;
  public socketId: any;
  /*
    * Chat and message related variables ends
    */


  constructor(
    private chatService : ChatService,
    private socketService : SocketService,
    private route :ActivatedRoute,
    private router :Router
  ) { }

  ngOnInit() {

    /*
        * getting userID from URL using 'route.snapshot'
        */
    this.userId = this.route.snapshot.params['userid'];

    if(this.userId === '' || typeof this.userId === 'undefined') {
      this.router.navigate(['/']);
    }else{

      /*
            * function to check if user is logged in or not starts
            */
      this.chatService.userSessionCheck(this.userId,( error, response )=>{

        if(error) {
          this.router.navigate(['/']); /* Home page redirection */
        }else{

          this.username = response.username;
          this.overlayDisplay = true;

          /*
                     * making socket connection by passing UserId.
                     */
          this.socketService.connectSocket(this.userId);
          this.socketService.getChatList(this.userId).subscribe(response => {

            if(!response.error) {

              if(response.singleUser) {

                /*
                            * Removing duplicate user from chat list array.
                            */
                if(this.chatListUsers.length > 0) {
                  this.chatListUsers = this.chatListUsers.filter(function( obj ) {
                    return obj._id !== response.chatList._id;
                  });
                }

                /*
                            * Adding new online user into chat list array
                            */
                this.chatListUsers.push(response.chatList);

              }else if(response.userDisconnected){
                this.chatListUsers = this.chatListUsers.filter(function( obj ) {
                  return obj.socketId !== response.socketId;
                });
              }else{
                /*
                            * Updating entire chatlist if user logs in.
                            */
                this.chatListUsers = response.chatList;
              }
            }else{
              alert('Chat list failure.');
            }
          });
          /*
                    * Code to get the real time messages goes here
                    */

          /*
                    * Code for Real time chat list update goes here
                    */

          this.socketService.receiveMessages().subscribe(response => {
            if(this.selectedUserId && this.selectedUserId == response.fromUserId) {
              this.messages.push(response);
              setTimeout( () =>{
                document.querySelector(`.message-thread`).scrollTop = document.querySelector(`.message-thread`).scrollHeight;
              },100);
            }
          });

        }
      });
    }
  }
  selectedUser(user):void{
    this.selectedUserId = user._id;
    this.selectedSocketId = user.socketId;
    this.selectedUserName = user.username;

    /*
      * calling method to get the messages
      */
    this.chatService.getMessages({ userId : this.userId,toUserId :user._id} , ( error , response)=>{
      if(!response.error) {
        this.messages = response.messages;
      }
    });
  }

  isUserSelected(userId:string):boolean{
    if(!this.selectedUserId) {
      return false;
    }
    return this.selectedUserId === userId;
  }

  alignMessage(userId){
    return this.userId !== userId;
  }

  sendMessage(event){
    if(event.keyCode === 13) {
      if(this.message === '' || this.message === null) {
        alert(`Message can't be empty.`);
      }else{

        if (this.message === '') {
          alert(`Message can't be empty.`);
        }else if(this.userId === ''){
          this.router.navigate(['/']);
        }else if(this.selectedUserId === ''){
          alert('Select a user to chat.');
        }else{

          const data = {
            fromUserId : this.userId,
            message : (this.message).trim(),
            toUserId : this.selectedUserId,
            toSocketId : this.selectedSocketId,
            fromSocketId : this.socketId
          }
          this.messages.push(data);
          setTimeout( () =>{
            document.querySelector('.message-thread').scrollTop = document.querySelector('.message-thread').scrollHeight;
          },100);

          /*
                  * calling method to send the messages
                  */
          this.message = null;
          this.socketService.sendMessage(data);
        }
      }
    }
  }
  logout(){
    this.socketService.logout({userId : this.userId}).subscribe(response => {
      this.router.navigate(['/']); /* Home page redirection */
    });
  }

}
