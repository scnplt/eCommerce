import { Component, inject, OnInit } from '@angular/core';
import { Product } from '../../common/product';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  private route: ActivatedRoute = inject(ActivatedRoute);
  private productService: ProductService = inject(ProductService);

  product!: Product;

  ngOnInit() {
    this.route.paramMap.subscribe(() => this.handleProductDetails());
  }

  handleProductDetails() {
    const productId: number = +this.route.snapshot.paramMap.get('id')!;
    this.productService.getProduct(productId).subscribe(data => this.product = data);
  }

}
