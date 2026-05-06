package com.supplychain.backend.dto;

import com.supplychain.backend.model.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class OrderResponse {
    private String id;
    private List<OrderItem> items;
    private Integer totalQuantity;
    private LocalDate orderDate;
    private LocalDate deliveryDate;
    private Integer warehouseId;
    private String orderStatus;
}