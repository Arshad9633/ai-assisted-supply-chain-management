package com.supplychain.backend.dto;

import com.supplychain.backend.model.OrderItem;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class OrderRequest {

    @NotEmpty(message = "Order items are required")
    @Valid
    private List<OrderItem> items;

    @NotNull(message = "Order date is required")
    private LocalDate orderDate;

    private LocalDate deliveryDate;

    @NotNull(message = "Warehouse ID is required")
    private Integer warehouseId;

    @NotBlank(message = "Order status is required")
    private String orderStatus;
}