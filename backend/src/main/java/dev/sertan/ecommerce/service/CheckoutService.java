package dev.sertan.ecommerce.service;

import dev.sertan.ecommerce.dto.Purchase;
import dev.sertan.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
