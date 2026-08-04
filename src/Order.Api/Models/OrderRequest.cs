namespace Order.Api.Models;

public class OrderRequest
{
    public int CustomerId { get; set; }

    public int ProductId { get; set; }

    public int Quantity { get; set; }

    public decimal Amount { get; set; }
}