import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import{ MatDialogModule} from '@angular/material';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { HomePageComponent } from './home-page/home-page.component';
import {MatFormFieldModule, MatInputModule} from '@angular/material';
import {MatRadioModule} from '@angular/material/radio';
import {MatGridListModule, MatGridList} from '@angular/material/grid-list';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { PlayComponent } from './play/play.component';
import { SinglePlayerComponent } from './single-player/single-player.component';
import { TwoPlayersComponent} from './two-players/two-players.component';
import {MatCardModule} from '@angular/material/card';
import { ChatComponent } from './chat/chat.component';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material';
import {MatSnackBarModule} from '@angular/material';
import  {Howl}  from 'howler';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { Options } from 'selenium-webdriver/chrome';
import {ProgressBarModule} from 'angular-progress-bar';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {CookieService} from 'ngx-cookie-service';
import { PlayerService } from './player.service';
// import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
// import {ErrorStateMatcher} from '@angular/material/core';
import { TopicService } from './topic.service';
import { AuthGuard } from './AuthGuard';
import { LoginService } from './login.service';
import {MatButtonToggleModule} from '@angular/material/button-toggle';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginComponent,
    PlayComponent,
    SinglePlayerComponent,
    TwoPlayersComponent,
    ChatComponent,
    SignupComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatRadioModule,
    MatGridListModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    MatInputModule,
    AppRoutingModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatSnackBarModule,
    ProgressBarModule,
    MatProgressBarModule,
    MatButtonToggleModule
  ],
  providers: [
    PlayerService,
    CookieService,
    TopicService,
    AuthGuard,
    LoginService
  ],
  bootstrap: [AppComponent],
})

export class AppModule { }
