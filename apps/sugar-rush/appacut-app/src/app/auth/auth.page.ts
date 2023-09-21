import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'shoppr-monorepo-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  codeSent = false;
  signupRequired = false;

  constructor(
    private navController: NavController,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  requestOTP() {
    this.codeSent = true;
  }

  submitOTP() {
    this.signupRequired = true;
  }

  completeProfile() {
    this.authService.setTokenAndUpdateCurrentUser('demo');
    this.navController.pop();
  }
}
