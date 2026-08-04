using OrderModels = Order.Api.Models;
using SharedContracts = Shared.Contracts.Order;

namespace Order.Api.Services;

public interface IOrderService
{
    Task<OrderModels.OrderResponse> CreateOrderAsync(SharedContracts.OrderRequest request);

    IEnumerable<OrderModels.Order> GetOrders();

    OrderModels.Order? GetOrder(int id);
}