import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  SIGNUP_URI = 'http://172.23.238.164:7000/Authentication/signup';
  LOGIN_URI = 'http://172.23.238.164:7000/Authentication/login';
  constructor(private httpClient: HttpClient) { }

//   PostData(player:any)
//   {
//     this.httpClient.post(this.LIVE_URI,player).subscribe(data=> console.log("POST request is successful"));
//   }

GetUser(email:string, password:string){
 return this.httpClient.post(this.LOGIN_URI,
    {
      "Email": email,
      "Password": password
    });
}

PostUser(name:string, email:string, password:string){
  this.httpClient.post(this.SIGNUP_URI,
    {
      "Name" : name,
      "Email": email,
      "Password": password
    }).subscribe(
      data => {
        console.log('mjddbh');
      }
    )
}

TestToken(){
 return this.httpClient.get("http://172.23.238.164:7000/questiongenerator/topics");
}
}
