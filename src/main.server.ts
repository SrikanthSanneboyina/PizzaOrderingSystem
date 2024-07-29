import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { OrderEntryComponent } from './app/order-entry/order-entry.component';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
