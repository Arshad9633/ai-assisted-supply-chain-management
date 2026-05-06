package com.supplychain.backend.repository;

import com.supplychain.backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {

    List<Order> findByWarehouseId(Integer warehouseId);

    List<Order> findByOrderStatus(String orderStatus);
}