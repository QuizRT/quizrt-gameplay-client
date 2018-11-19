import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { PlayersComponent } from './players/players.component';
import { LoginComponent } from './login/login.component';
import { PlayComponent } from './play/play.component';
import { SinglePlayerComponent } from './single-player/single-player.component';
import { TwoPlayersComponent } from './two-players/two-players.component';
import { ThreePlayersComponent } from './three-players/three-players.component';
import { FourPlayersComponent } from './four-players/four-players.component';
import { ChatComponent } from './chat/chat.component';

const routes: Route[] = [

   {path: '', component: HomePageComponent},
   {path: 'home-page', component:HomePageComponent},
   {path: 'players', component: PlayersComponent},
   {path: 'login', component: LoginComponent},
   {path: 'play', component: PlayComponent},
   {path: 'play/chat', component: ChatComponent},
   {path: 'play/single-player', component: SinglePlayerComponent},
   {path: 'play/two-players', component: TwoPlayersComponent},
   {path: 'play/three-players', component: ThreePlayersComponent},
   {path: 'play/four-players', component: FourPlayersComponent},
   {path: 'play/single-player/play', component: PlayComponent}
 ];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
