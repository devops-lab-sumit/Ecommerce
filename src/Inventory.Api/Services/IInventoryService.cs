using Shared.Contracts.Inventory;

namespace Inventory.Api.Services;

public interface IInventoryService
{
    ReserveStockResponse ReserveStock(ReserveStockRequest request);
}