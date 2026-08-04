using OrderModels = Order.Api.Models;

namespace Order.Api.Repositories;

public interface IOrderRepository
{
    IEnumerable<OrderModels.Order> GetAll();

    OrderModels.Order? GetById(int id);

    OrderModels.Order Add(OrderModels.Order order);
}