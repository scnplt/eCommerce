import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';

@Injectable({ providedIn: 'root' })
export class ProductService {

  private http = inject(HttpClient);
  private baseUrl = "http://localhost:8080/api/products";

  getProductsList(categoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}&size=100`;
    return this.http.get<GetResponse>(searchUrl).pipe(map(res => res._embedded.products));
  }

}

interface GetResponse {
  _embedded: {
    products: Product[];
  }
}
