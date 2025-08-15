import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

const BASE_URL = "http://localhost:8080/api";

@Injectable({ providedIn: 'root' })
export class ProductService {

  private http = inject(HttpClient);
  private productsUrl = `${BASE_URL}/products`;
  private categoryUrl = `${BASE_URL}/product-category`;

  getProductsListPaginate(page: number, pageSize: number, categoryId: number): Observable<GetResponseProducts> {
    const searchUrl = `${this.productsUrl}/search/findByCategoryId?id=${categoryId}&page=${page}&size=${pageSize}`;
    return this.http.get<GetResponseProducts>(searchUrl);
  }

  getProductsList(categoryId: number): Observable<Product[]> {
    const searchUrl = `${this.productsUrl}/search/findByCategoryId?id=${categoryId}`;
    return this.getProducts(searchUrl);
  }

  getProduct(productId: number): Observable<Product> {
    const productUrl = `${this.productsUrl}/${productId}`;
    return this.http.get<Product>(productUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.http.get<GetResponseProductCategory>(this.categoryUrl)
      .pipe(map(res => res._embedded.productCategory));
  }

  searchProducts(keyword: string): Observable<Product[]> {
    const searchUrl = `${this.productsUrl}/search/findByNameContaining?name=${keyword}`;
    return this.getProducts(searchUrl);
  }

  searchProductsPaginate(page: number, pageSize: number, keyword: string): Observable<GetResponseProducts> {
    const searchUrl = `${this.productsUrl}/search/findByNameContaining?name=${keyword}&page=${page}&size=${pageSize}`;
    return this.http.get<GetResponseProducts>(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.http.get<GetResponseProducts>(searchUrl)
      .pipe(map(res => res._embedded.products));
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
