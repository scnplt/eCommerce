import { Country } from './../../common/country';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { ShopFormService } from '../../services/shop-form.service';
import { State } from '../../common/state';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private shopFormService: ShopFormService = inject(ShopFormService);

  countries: Country[] = [];

  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  checkoutFormGroup: FormGroup = this.formBuilder.group({
    customer: this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
    }),
    shippingAddress: this.formBuilder.group({
      street: [''],
      city: [''],
      state: [''],
      country: [''],
      zipCode: [''],
    }),
    billingAddress: this.formBuilder.group({
      street: [''],
      city: [''],
      state: [''],
      country: [''],
      zipCode: [''],
    }),
    creditCard: this.formBuilder.group({
      cardType: [''],
      nameOnCard: [''],
      cardNumber: [''],
      securityCode: [''],
      expirationMonth: [''],
      expirationYear: [''],
    }),
  });

  ngOnInit() {
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

  copyShippingAddressToBillingAddress(event: any) {
    if (!event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
      return;
    }

    this.checkoutFormGroup.controls['billingAddress'].setValue(
      this.checkoutFormGroup.controls['shippingAddress'].value
    );
    this.billingAddressStates = this.shippingAddressStates;
  }

  onSubmit() {
    console.log('Handling the submit button');
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
