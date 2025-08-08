import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  addToCart(cartItem: CartItem) {
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if (this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(
        (tempCartItem) => tempCartItem.id === cartItem.id,
      );

      alreadyExistsInCart = existingCartItem != undefined;
    }

    alreadyExistsInCart
      ? existingCartItem!.quantity++
      : this.cartItems.push(cartItem);

    this.computeCartTotals();
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;
    cartItem.quantity === 0 ? this.remove(cartItem) : this.computeCartTotals();
  }

  remove(cartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex((ci) => ci.id === cartItem.id);
    if (itemIndex < 0) return;
    this.cartItems.splice(itemIndex, 1);
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPrice: number = 0;
    let totalQuantity: number = 0;

    for (let cartItem of this.cartItems) {
      totalPrice += cartItem.quantity * cartItem.unitPrice;
      totalQuantity += cartItem.quantity;
    }

    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuantity);
  }
}
