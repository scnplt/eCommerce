import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ProductCategoryMenuComponent],
  templateUrl: './app.html'
})
export class App { }
