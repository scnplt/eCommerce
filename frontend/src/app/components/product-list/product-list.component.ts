import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe, RouterLink, NgbPagination],
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private productService: ProductService = inject(ProductService);

  products: Product[] = [];
  private currentCategoryId: number = 1;
  private previousCategoryId: number = 1;
  currentCategoryName: string = '';
  searchMode: boolean = false;

  pageNumber: number = 1;
  pageSize = signal<number>(5);
  totalElements: number = 0;

  previousKeyword: string = "";

  constructor() {
    effect(() => {
      this.listProducts();
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    this.searchMode ? this.handleSearchProducts() : this.handleListProducts();
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    const hasCategoryName: boolean = this.route.snapshot.paramMap.has('name');

    this.currentCategoryId = hasCategoryId ? +this.route.snapshot.paramMap.get('id')! : this.currentCategoryId;
    this.currentCategoryName = hasCategoryName ? this.route.snapshot.paramMap.get('name')! : this.currentCategoryName;

    if (this.previousCategoryId != this.currentCategoryId) this.pageNumber = 1;
    this.previousCategoryId = this.currentCategoryId;

    this.productService
      .getProductsListPaginate(this.pageNumber - 1, this.pageSize(), this.currentCategoryId)
      .subscribe(this.processPaginateResult());
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword != keyword) this.pageNumber = 1;
    this.previousKeyword = keyword;

    this.productService
      .searchProductsPaginate(this.pageNumber - 1, this.pageSize(), keyword)
      .subscribe(this.processPaginateResult());
  }

  updatePageSize(newSize: string) {
    this.pageSize.set(+newSize);
    this.pageNumber = 1;
  }

  private processPaginateResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize.set(data.page.size);
      this.totalElements = data.page.totalElements;
    };
  }

}
