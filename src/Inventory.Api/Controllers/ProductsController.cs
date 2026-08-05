using Inventory.Api.Models;
using Inventory.Api.Repositories;
using Inventory.Api.Services;
using Microsoft.AspNetCore.Mvc;
using SharedContracts = Shared.Contracts.Inventory;

namespace Inventory.Api.Controllers;

[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    private readonly IProductRepository _repository;
    private readonly IInventoryService _inventoryService;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(
        IProductRepository repository,
        IInventoryService inventoryService,
        ILogger<ProductsController> logger)
    {
        _repository = repository;
        _inventoryService = inventoryService;
        _logger = logger;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        _logger.LogInformation("Returning all products");

        return Ok(_repository.GetAll());
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var product = _repository.GetById(id);

        if (product == null)
            return NotFound();

        return Ok(product);
    }

    [HttpPost]
    public IActionResult Add(Product product)
    {
        var created = _repository.Add(product);

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPost("reserve")]
    public IActionResult Reserve(SharedContracts.ReserveStockRequest request)
    {
        _logger.LogInformation(
            "Reserve request received. ProductId: {ProductId}, Quantity: {Quantity}",
            request.ProductId,
            request.Quantity);

        var response = _inventoryService.ReserveStock(request);

        return Ok(response);
    }

    [HttpDelete("{id}")]
public IActionResult Delete(int id)
{
    var deleted = _repository.Delete(id);

    if (!deleted)
        return NotFound();

    return NoContent();
}
}