import { Component, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  imports: [CurrencyPipe],
  templateUrl: './product-list-grid.component.html'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  currentCategoryName: string = 'Books';

  constructor(private productService: ProductService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  listProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');
    const hasCategoryName: boolean = this.route.snapshot.paramMap.has('name');

    this.currentCategoryId = hasCategoryId ? +this.route.snapshot.paramMap.get('id')! : this.currentCategoryId;
    this.currentCategoryName = hasCategoryName ? this.route.snapshot.paramMap.get('name')! : this.currentCategoryName;

    this.productService.getProductsList(this.currentCategoryId)
      .subscribe(data => this.products = data);
  }

}
