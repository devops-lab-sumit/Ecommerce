namespace Inventory.Api.Models;

public class ReserveStockRequest
{
    public int ProductId { get; set; }

    public int Quantity { get; set; }
}