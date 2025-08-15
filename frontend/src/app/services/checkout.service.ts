import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private purchaseUrl = 'http://localhost:8080/api/checkout/purchase';
  private http = inject(HttpClient);

  placeOrder(purchase: Purchase): Observable<any> {
    return this.http.post<Purchase>(this.purchaseUrl, purchase);
  }
}
