import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  LIVE_URI="http://localhost:3000/players";
  constructor(private httpClient: HttpClient) { }

//   PostData(player:any)
//   {
//     this.httpClient.post(this.LIVE_URI,player).subscribe(data=> console.log("POST request is successful"));
//   }
}
