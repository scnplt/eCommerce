import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private http = inject(HttpClient);
  private baseUrl = "http://localhost:8080/api/products?size=100";

  getProductsList(): Observable<Product[]> {
    return this.http.get<GetResponse>(this.baseUrl)
      .pipe(map(res => res._embedded.products));
  }

}

interface GetResponse {
  _embedded: {
    products: Product[];
  }
}
