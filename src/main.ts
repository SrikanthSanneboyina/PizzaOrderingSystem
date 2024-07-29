import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { OrderEntryComponent } from './app/order-entry/order-entry.component';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
