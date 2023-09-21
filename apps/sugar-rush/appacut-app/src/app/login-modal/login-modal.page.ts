import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'shoppr-monorepo-login-modal',
  templateUrl: './login-modal.page.html',
  styleUrls: ['./login-modal.page.scss'],
})
export class LoginModalPage implements OnInit {
  constructor(
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  requestMagicLink(email: any) {
    this.authService.requestMagicLink(email).subscribe(
      async (res: any) => {
        console.log(res);
        const toast = await this.toastController.create({
          message: 'Please check your email.',
          duration: 2000,
        });
        toast.present();
      },
      async (err: any) => {
        console.log(err);
        const toast = await this.toastController.create({
          message: 'There was an unknown error.',
          duration: 2000,
        });
        toast.present();
      }
    );
  }
}
