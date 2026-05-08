package com.supplychain.backend.service;

import com.supplychain.backend.dto.OrderRequest;
import com.supplychain.backend.dto.OrderResponse;
import com.supplychain.backend.exception.BadRequestException;
import com.supplychain.backend.exception.ResourceNotFoundException;
import com.supplychain.backend.model.Inventory;
import com.supplychain.backend.model.Order;
import com.supplychain.backend.model.OrderItem;
import com.supplychain.backend.repository.InventoryRepository;
import com.supplychain.backend.repository.OrderRepository;
import com.supplychain.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;

    public OrderService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        InventoryRepository inventoryRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public OrderResponse createOrder(OrderRequest request) {
        validateOrderItems(request);

        for (OrderItem item : request.getItems()) {
            Inventory inventory = inventoryRepository
                    .findByProductIdAndWarehouseId(
                            item.getProductId(),
                            item.getWarehouseId()
                    )
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Inventory not found for product id: " + item.getProductId()
                                    + " in warehouse id: " + item.getWarehouseId()
                    ));

            if (inventory.getStockLevel() < item.getQuantity()) {
                throw new BadRequestException(
                        "Insufficient stock for product id: " + item.getProductId()
                                + " in warehouse id: " + item.getWarehouseId()
                );
            }
        }

        for (OrderItem item : request.getItems()) {
            Inventory inventory = inventoryRepository
                    .findByProductIdAndWarehouseId(
                            item.getProductId(),
                            item.getWarehouseId()
                    )
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Inventory not found for product id: " + item.getProductId()
                                    + " in warehouse id: " + item.getWarehouseId()
                    ));

            inventory.setStockLevel(inventory.getStockLevel() - item.getQuantity());
            inventoryRepository.save(inventory);
        }

        Order order = new Order();
        order.setItems(request.getItems());
        order.setOrderDate(request.getOrderDate());
        order.setDeliveryDate(request.getDeliveryDate());
        order.setOrderStatus(request.getOrderStatus());

        Order savedOrder = orderRepository.save(order);
        return mapToResponse(savedOrder);
    }

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public OrderResponse getOrderById(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        return mapToResponse(order);
    }

    public List<OrderResponse> getOrdersByStatus(String orderStatus) {
        return orderRepository.findByOrderStatus(orderStatus)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public OrderResponse updateOrderStatus(String id, String status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        String oldStatus = order.getOrderStatus();

        if ("Cancelled".equalsIgnoreCase(status)
                && !"Cancelled".equalsIgnoreCase(oldStatus)) {
            restoreInventory(order);
        }

        order.setOrderStatus(status);
        Order updatedOrder = orderRepository.save(order);

        return mapToResponse(updatedOrder);
    }

    public void deleteOrder(String id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        if (!"Cancelled".equalsIgnoreCase(order.getOrderStatus())) {
            restoreInventory(order);
        }

        orderRepository.deleteById(id);
    }

    private void validateOrderItems(OrderRequest request) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("At least one order item is required");
        }

        for (OrderItem item : request.getItems()) {
            if (!productRepository.existsById(item.getProductId())) {
                throw new ResourceNotFoundException(
                        "Product not found with id: " + item.getProductId()
                );
            }

            if (item.getQuantity() == null || item.getQuantity() <= 0) {
                throw new BadRequestException("Quantity must be greater than 0");
            }

            if (item.getWarehouseId() == null) {
                throw new BadRequestException("Warehouse ID is required for each order item");
            }
        }
    }

    private void restoreInventory(Order order) {
        if (order.getItems() == null) {
            return;
        }

        for (OrderItem item : order.getItems()) {
            Inventory inventory = inventoryRepository
                    .findByProductIdAndWarehouseId(
                            item.getProductId(),
                            item.getWarehouseId()
                    )
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Inventory not found for product id: " + item.getProductId()
                                    + " in warehouse id: " + item.getWarehouseId()
                    ));

            inventory.setStockLevel(inventory.getStockLevel() + item.getQuantity());
            inventoryRepository.save(inventory);
        }
    }

    private OrderResponse mapToResponse(Order order) {
        List<OrderItem> items = order.getItems();

        if (items == null) {
            items = List.of();
        }

        Integer totalQuantity = items
                .stream()
                .mapToInt(item -> item.getQuantity() == null ? 0 : item.getQuantity())
                .sum();

        return new OrderResponse(
                order.getId(),
                items,
                totalQuantity,
                order.getOrderDate(),
                order.getDeliveryDate(),
                order.getOrderStatus()
        );
    }
}