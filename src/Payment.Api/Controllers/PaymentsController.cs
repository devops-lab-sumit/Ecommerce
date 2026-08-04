using Microsoft.AspNetCore.Mvc;
using Payment.Api.Models;
using Payment.Api.Repositories;
using Payment.Api.Services;

namespace Payment.Api.Controllers;

[ApiController]
[Route("api/payments")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _service;
    private readonly IPaymentRepository _repository;
    private readonly ILogger<PaymentsController> _logger;

    public PaymentsController(
        IPaymentService service,
        IPaymentRepository repository,
        ILogger<PaymentsController> logger)
    {
        _service = service;
        _repository = repository;
        _logger = logger;
    }

    [HttpPost]
    public async Task<IActionResult> Pay(PaymentRequest request)
    {
        _logger.LogInformation(
            "Processing payment for Order {OrderId}",
            request.OrderId);

        var response = await _service.ProcessPaymentAsync(request);

        return Ok(response);
    }

    [HttpGet]
    public IActionResult GetPayments()
    {
        return Ok(_repository.GetAll());
    }
}