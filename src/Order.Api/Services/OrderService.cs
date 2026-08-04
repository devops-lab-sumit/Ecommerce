using OrderModels = Order.Api.Models;
using Order.Api.HttpClients;
using Order.Api.Repositories;

namespace Order.Api.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _repository;

    // public OrderService(IOrderRepository repository)
    // {
    //     _repository = repository;
    // }

    private readonly CustomerApiClient _customerClient;
    private readonly InventoryApiClient _inventoryClient;
    private readonly PaymentApiClient _paymentClient;
    private readonly NotificationApiClient _notificationClient;

    public OrderService(
        IOrderRepository repository,
        CustomerApiClient customerClient,
        InventoryApiClient inventoryClient,
        PaymentApiClient paymentClient,
        NotificationApiClient notificationClient)
    {
        _repository = repository;
        _customerClient = customerClient;
        _inventoryClient = inventoryClient;
        _paymentClient = paymentClient;
        _notificationClient = notificationClient;
    }

    // public async Task<OrderModels.OrderResponse> CreateOrderAsync(OrderModels.OrderRequest request)
    // {
    //     await Task.Delay(500);

    //     var order = new OrderModels.Order
    //     {
    //         CustomerId = request.CustomerId,
    //         ProductId = request.ProductId,
    //         Quantity = request.Quantity,
    //         Amount = request.Amount,
    //         Status = "Created"
    //     };

    //     var created = _repository.Add(order);

    //     return new OrderModels.OrderResponse
    //     {
    //         Success = true,
    //         Message = "Order Created Successfully",
    //         OrderId = created.Id
    //     };
    // }


    public async Task<OrderModels.OrderResponse> CreateOrderAsync(OrderModels.OrderRequest request)
    {
        var customer =
            await _customerClient.GetCustomerAsync(request.CustomerId);

        if (customer == null)
        {
            return new OrderModels.OrderResponse
            {
                Success = false,
                Message = "Customer not found"
            };
        }

        // var inventoryReserved =
        //     await _inventoryClient.ReserveStockAsync(
        //         request.ProductId,
        //         request.Quantity);

        // if (!inventoryReserved)
        // {
        //     return new OrderModels.OrderResponse
        //     {
        //         Success = false,
        //         Message = "Inventory reservation failed"
        //     };
        // }

        var inventoryReserved =
        await _inventoryClient.ReserveStockAsync(
            request.ProductId,
            request.Quantity);

        if (inventoryReserved == null || !inventoryReserved.Success)
        {
            return new OrderModels.OrderResponse
            {
                Success = false,
                Message = inventoryReserved?.Message ?? "Inventory reservation failed"
            };
        }

        // var paymentSuccess =
        //     await _paymentClient.ProcessPaymentAsync(
        //         0,
        //         request.Amount);

        // if (!paymentSuccess)
        // {
        //     return new OrderModels.OrderResponse
        //     {
        //         Success = false,
        //         Message = "Payment failed"
        //     };
        // }
        var paymentResponse =
            await _paymentClient.ProcessPaymentAsync(
                0,
                request.Amount);

        if (paymentResponse == null || !paymentResponse.Success)
        {
            return new OrderModels.OrderResponse
            {
                Success = false,
                Message = paymentResponse?.Message ?? "Payment failed"
            };
        }
        await _notificationClient.SendNotificationAsync(
            customer.Name,
            customer.Email);

        var order = new OrderModels.Order
        {
            CustomerId = request.CustomerId,
            ProductId = request.ProductId,
            Quantity = request.Quantity,
            Amount = request.Amount,
            Status = "Completed"
        };

        var created = _repository.Add(order);

        return new OrderModels.OrderResponse
        {
            Success = true,
            Message = "Order Created Successfully",
            OrderId = created.Id
        };
    }
    public IEnumerable<OrderModels.Order> GetOrders()
    {
        return _repository.GetAll();
    }

    public OrderModels.Order? GetOrder(int id)
    {
        return _repository.GetById(id);
    }
}