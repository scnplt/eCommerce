import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { CartStatusComponent } from './components/cart-status/cart-status.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    ProductCategoryMenuComponent,
    SearchComponent,
    CartStatusComponent,
  ],
  templateUrl: './app.html',
})
export class App {}
