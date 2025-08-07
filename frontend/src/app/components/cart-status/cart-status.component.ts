import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-cart-status',
  imports: [CurrencyPipe],
  templateUrl: './cart-status.component.html',
})
export class CartStatusComponent implements OnInit {
  private cartService: CartService = inject(CartService);

  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  ngOnInit() {
    this.updateCartStatus();
  }

  updateCartStatus() {
    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));
    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data),
    );
  }
}
