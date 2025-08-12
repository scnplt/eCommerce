package dev.sertan.ecommerce.dto;

import dev.sertan.ecommerce.entity.Address;
import dev.sertan.ecommerce.entity.Customer;
import dev.sertan.ecommerce.entity.Order;
import dev.sertan.ecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
