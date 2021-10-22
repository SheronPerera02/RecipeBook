import {Component, OnInit} from '@angular/core';
import {DataStorageService} from './shared/data-storage.service';
import {AuthService} from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private dataStorageService: DataStorageService) {
  }

  ngOnInit(): void {
    const autoLogged: boolean = this.authService.autoLogin();
    if (autoLogged) {
      this.dataStorageService.fetchRecipes(false);
    }
  }

}
