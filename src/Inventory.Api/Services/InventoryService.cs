using Inventory.Api.Models;
using Inventory.Api.Repositories;

namespace Inventory.Api.Services;

public class InventoryService : IInventoryService
{
    private readonly IProductRepository _repository;

    public InventoryService(IProductRepository repository)
    {
        _repository = repository;
    }

    public ReserveStockResponse ReserveStock(ReserveStockRequest request)
    {
        var product = _repository.GetById(request.ProductId);

        if (product == null)
        {
            return new ReserveStockResponse
            {
                Success = false,
                Message = "Product not found"
            };
        }

        if (product.Stock < request.Quantity)
        {
            return new ReserveStockResponse
            {
                Success = false,
                Message = "Insufficient Stock",
                RemainingStock = product.Stock
            };
        }

        product.Stock -= request.Quantity;

        _repository.Update(product);

        return new ReserveStockResponse
        {
            Success = true,
            Message = "Stock Reserved",
            RemainingStock = product.Stock
        };
    }
}