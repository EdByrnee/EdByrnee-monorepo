import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NxWelcomeComponent } from './nx-welcome.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { DelliDropsService } from './delli-drops.service';
import { DropsPageComponent } from './drops-page/drops-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthorizationHttpInterceptor } from './core/app-http.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent, DropsPageComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes, { initialNavigation: 'enabledBlocking' }),
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSortModule,
    MatSelectModule,
  ],
  providers: [
    DelliDropsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
