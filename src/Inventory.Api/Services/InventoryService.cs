using Inventory.Api.Repositories;
using Shared.Contracts.Inventory;

namespace Inventory.Api.Services;

public class InventoryService : IInventoryService
{
    private readonly IProductRepository _repository;
    private readonly ILogger<InventoryService> _logger;

    public InventoryService(
        IProductRepository repository,
        ILogger<InventoryService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public ReserveStockResponse ReserveStock(ReserveStockRequest request)
    {
        _logger.LogInformation(
            "Reserving stock. ProductId: {ProductId}, Quantity: {Quantity}",
            request.ProductId,
            request.Quantity);

        var product = _repository.GetById(request.ProductId);

        if (product == null)
        {
            return new ReserveStockResponse
            {
                Success = false,
                Message = "Product not found",
                RemainingStock = 0
            };
        }

        if (product.Stock < request.Quantity)
        {
            return new ReserveStockResponse
            {
                Success = false,
                Message = "Insufficient stock",
                RemainingStock = product.Stock
            };
        }

        product.Stock -= request.Quantity;

        return new ReserveStockResponse
        {
            Success = true,
            Message = "Stock Reserved",
            RemainingStock = product.Stock
        };
    }
}