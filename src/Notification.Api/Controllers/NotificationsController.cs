using Microsoft.AspNetCore.Mvc;
using Notification.Api.Repositories;
using Notification.Api.Services;
using Shared.Contracts.Notification;

namespace Notification.Api.Controllers;

[ApiController]
[Route("api/notifications")]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _service;
    private readonly INotificationRepository _repository;

    public NotificationsController(
        INotificationService service,
        INotificationRepository repository)
    {
        _service = service;
        _repository = repository;
    }

    [HttpPost]
    public async Task<IActionResult> Send(NotificationRequest request)
    {
        var response = await _service.SendAsync(request);

        return Ok(response);
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_repository.GetAll());
    }
}