import { Country } from './../../common/country';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ShopFormService } from '../../services/shop-form.service';
import { State } from '../../common/state';
import { ShopValidators } from '../../validators/shop-validators';
import { CartService } from '../../services/cart.service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private shopFormService: ShopFormService = inject(ShopFormService);
  private cartService: CartService = inject(CartService);

  countries: Country[] = [];

  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  checkoutFormGroup: FormGroup = this.formBuilder.group({
    customer: this.formBuilder.group({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        ShopValidators.notOnlyWhitespace
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        ShopValidators.notOnlyWhitespace
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ShopValidators.notOnlyWhitespace
      ]),
    }),
    shippingAddress: this.formBuilder.group({
      street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
      city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
    }),
    billingAddress: this.formBuilder.group({
      street: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
      city: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
      state: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      zipCode: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
    }),
    creditCard: this.formBuilder.group({
      cardType: new FormControl('', [Validators.required]),
      nameOnCard: new FormControl('', [Validators.required, Validators.minLength(2), ShopValidators.notOnlyWhitespace]),
      cardNumber: new FormControl('', [Validators.required, Validators.pattern("[0-9]{16}")]),
      securityCode: new FormControl('', [Validators.required, Validators.pattern("[0-9]{3}")]),
      expirationMonth: [''],
      expirationYear: [''],
    }),
  });

  ngOnInit() {
    this.reviewCartDetails();

    const startMonth: number = new Date().getMonth() + 1;

    this.shopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => (this.creditCardMonths = data));

    this.shopFormService
      .getCreditCardYears()
      .subscribe((data) => (this.creditCardYears = data));

    this.shopFormService
      .getCountries()
      .subscribe((data) => (this.countries = data));
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  reviewCartDetails() {
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data);
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (!event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
      return;
    }

    this.checkoutFormGroup.controls['billingAddress'].setValue(
      this.checkoutFormGroup.controls['shippingAddress'].value,
    );
    this.billingAddressStates = this.shippingAddressStates;
  }

  onSubmit() {
    console.log('Handling the submit button');

    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer')?.value);
    console.log(
      'The email address is ' +
        this.checkoutFormGroup.get('customer')?.value.email,
    );

    console.log(
      'The shipping address country is ' +
        this.checkoutFormGroup.get('shippingAddress')?.value.country.name,
    );
    console.log(
      'The shipping address state is ' +
        this.checkoutFormGroup.get('shippingAddress')?.value.state.name,
    );
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get(
      'creditCard',
    ) as FormGroup;

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(
      creditCardFormGroup.value['expirationYear'],
    );

    let startMonth: number =
      currentYear === selectedYear ? new Date().getMonth() + 1 : 1;

    this.shopFormService
      .getCreditCardMonths(startMonth)
      .subscribe((data) => (this.creditCardMonths = data));
  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName) as FormGroup;
    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;
    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.shopFormService.getStates(countryCode).subscribe((data) => {
      if (formGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }
      formGroup.get('state')?.setValue(data[0]);
    });
  }
}
