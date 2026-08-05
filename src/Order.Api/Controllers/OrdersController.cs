using Microsoft.AspNetCore.Mvc;
using Order.Api.Models;
using Order.Api.Services;
using SharedContracts = Shared.Contracts.Order;

namespace Order.Api.Controllers;

[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _service;

    public OrdersController(IOrderService service)
    {
        _service = service;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_service.GetOrders());
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var order = _service.GetOrder(id);

        if (order == null)
            return NotFound();

        return Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> Create(SharedContracts.OrderRequest request)
    {
        var response = await _service.CreateOrderAsync(request);

        return Ok(response);
    }
}