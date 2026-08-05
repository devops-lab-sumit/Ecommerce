using CustomerModel = Customer.Api.Models.Customer;
using Customer.Api.Repositories;
using Microsoft.AspNetCore.Mvc;
using Shared.Contracts.Customer;

namespace Customer.Api.Controllers;

[ApiController]
[Route("api/customers")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerRepository _repository;
    private readonly ILogger<CustomersController> _logger;

    public CustomersController(
        ICustomerRepository repository,
        ILogger<CustomersController> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    [HttpGet]
    public IActionResult Get()
    {
        _logger.LogInformation("Getting all customers");

        var customers = _repository
            .GetAll()
            .Select(x => new CustomerDto
            {
                Id = x.Id,
                Name = x.Name,
                Email = x.Email
            });

        return Ok(customers);
    }

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var customer = _repository.Get(id);

        if (customer == null)
            return NotFound();

        return Ok(new CustomerDto
        {
            Id = customer.Id,
            Name = customer.Name,
            Email = customer.Email
        });
    }

    [HttpPost]
    public IActionResult Post(CustomerModel customer)
    {
        _logger.LogInformation("Creating customer {Name}", customer.Name);

        var result = _repository.Add(customer);

        return CreatedAtAction(nameof(Get), new { id = result.Id }, result);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        if (!_repository.Delete(id))
            return NotFound();

        return NoContent();
    }
}