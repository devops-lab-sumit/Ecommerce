using OrderModels = Order.Api.Models;
using Order.Api.Repositories;

namespace Order.Api.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _repository;

    public OrderService(IOrderRepository repository)
    {
        _repository = repository;
    }

    public async Task<OrderModels.OrderResponse> CreateOrderAsync(OrderModels.OrderRequest request)
    {
        await Task.Delay(500);

        var order = new OrderModels.Order
        {
            CustomerId = request.CustomerId,
            ProductId = request.ProductId,
            Quantity = request.Quantity,
            Amount = request.Amount,
            Status = "Created"
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