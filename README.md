public async Task<OrderResponse> CreateOrderAsync(OrderRequest request)
{
    var customer =
        await _customerClient.GetCustomerAsync(request.CustomerId);

    if (customer == null)
    {
        return new OrderResponse
        {
            Success = false,
            Message = "Customer not found"
        };
    }

    var inventoryReserved =
        await _inventoryClient.ReserveStockAsync(
            request.ProductId,
            request.Quantity);

    if (!inventoryReserved)
    {
        return new OrderResponse
        {
            Success = false,
            Message = "Inventory reservation failed"
        };
    }

    var paymentSuccess =
        await _paymentClient.ProcessPaymentAsync(
            0,
            request.Amount);

    if (!paymentSuccess)
    {
        return new OrderResponse
        {
            Success = false,
            Message = "Payment failed"
        };
    }

    await _notificationClient.SendNotificationAsync(
        customer.Name,
        customer.Email);

    var order = new Models.Order
    {
        CustomerId = request.CustomerId,
        ProductId = request.ProductId,
        Quantity = request.Quantity,
        Amount = request.Amount,
        Status = "Completed"
    };

    var created = _repository.Add(order);

    return new OrderResponse
    {
        Success = true,
        Message = "Order Created Successfully",
        OrderId = created.Id
    };
}

When you call

POST /api/orders

Order API will execute

Receive Request
        │
        ▼
Customer API
        │
        ▼
Inventory API
        │
        ▼
Payment API
        │
        ▼
Notification API
        │
        ▼
Save Order
        │
        ▼
Return Response

This is exactly how a real orchestration service works.