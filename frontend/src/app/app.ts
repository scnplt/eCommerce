import { Component, signal } from '@angular/core';
import { ProductListComponent } from './components/product-list/product-list.component';

@Component({
  selector: 'app-root',
  imports: [ProductListComponent],
  templateUrl: './app.html'
})
export class App { }
