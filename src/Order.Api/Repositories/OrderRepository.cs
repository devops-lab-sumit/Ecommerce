using OrderModels = Order.Api.Models;

namespace Order.Api.Repositories;

public class OrderRepository : IOrderRepository
{
    private static readonly List<OrderModels.Order> Orders = [];

    public IEnumerable<OrderModels.Order> GetAll()
    {
        return Orders;
    }

    public OrderModels.Order? GetById(int id)
    {
        return Orders.FirstOrDefault(x => x.Id == id);
    }

    public OrderModels.Order Add(OrderModels.Order order)
    {
        order.Id = Orders.Count + 1;
        order.CreatedAt = DateTime.UtcNow;

        Orders.Add(order);

        return order;
    }
}