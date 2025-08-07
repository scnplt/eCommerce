import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-list-grid.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private productService: ProductService = inject(ProductService);

  products: Product[] = [];
  private currentCategoryId: number = 1;
  currentCategoryName: string = '';
  searchMode: boolean = false;

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

    this.productService.getProductsList(this.currentCategoryId)
      .subscribe(data => this.products = data);
  }

  handleSearchProducts() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword')!;
    this.productService.searchProducts(keyword)
      .subscribe(data => this.products = data);
  }

}
