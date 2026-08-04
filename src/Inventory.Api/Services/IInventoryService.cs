using Inventory.Api.Models;

namespace Inventory.Api.Services;

public interface IInventoryService
{
    ReserveStockResponse ReserveStock(ReserveStockRequest request);
}