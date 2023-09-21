import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseAnalyticsPlugin } from '@capacitor-community/firebase-analytics';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { IUserProfile } from '@shoppr-monorepo/api-interfaces';
import { AnalyticsService } from '../../core/analytics';
import { AuthService } from '../../core/auth';
@Component({
  selector: 'shoppr-monorepo-complete-profile',
  templateUrl: './complete-profile.page.html',
  styleUrls: ['./complete-profile.page.scss'],
})
export class CompleteProfilePage implements OnInit {
  public currentUser$ = this.authService.currentUser$;

  public currentUserForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    // name: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });

  public profileCompleteMode = false;

  loadingCompleteProfile = false;

  constructor(
    public authService: AuthService,
    private alertController: AlertController,
    private toastController: ToastController,
    private navController: NavController,
    private firebaseAnalytics: AnalyticsService
  ) {
    this.currentUser$.subscribe((user) => {
      this.currentUserForm.patchValue({
        username: user?.username.toLowerCase(),
        // name: user?.name,
      });
    });
  }

  getUpdatedValues(): Partial<IUserProfile> {
    const updatedValues = this.currentUserForm.value;
    return updatedValues as Partial<IUserProfile>;
  }

  saveChanges() {
    this.loadingCompleteProfile = true;
    const username = this.currentUserForm.value.username;
    const updates: any = {
      username: username,
      name: username,
    };
    this.authService.updateCurrentUserProfile(updates, [], []).subscribe(
      async (ok) => {
        this.loadingCompleteProfile = false;
        const toast = await this.toastController.create({
          message: 'Your profile has been updated.',
          duration: 2000,
        });
        toast.present();

        this.navController.navigateRoot('/tabs');
        this.firebaseAnalytics.logEvent({
          name: 'complete_profile',
          params: {
            username: username,
            // name: this.currentUserForm.value.name,
            name: username,
          },
        });
      },
      async (error) => {
        this.loadingCompleteProfile = false;

        const errorType = error.error['error'];

        if (errorType === 'USERNAME_TAKEN') {
          const alert = await this.alertController.create({
            header: 'Username taken!',
            message: 'Please try another',
            buttons: ['OK'],
          });
          await alert.present();
        } else {
          const alert = await this.alertController.create({
            header: 'Profile Update Error',
            message:
              'There was an error updating your profile. Please try again.',
            buttons: ['OK'],
          });
          await alert.present();
        }
      }
    );
  }

  ngOnInit() {}
}
