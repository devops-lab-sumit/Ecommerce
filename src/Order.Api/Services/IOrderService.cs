using OrderModels = Order.Api.Models;

namespace Order.Api.Services;

public interface IOrderService
{
    Task<OrderModels.OrderResponse> CreateOrderAsync(OrderModels.OrderRequest request);

    IEnumerable<OrderModels.Order> GetOrders();

    OrderModels.Order? GetOrder(int id);
}