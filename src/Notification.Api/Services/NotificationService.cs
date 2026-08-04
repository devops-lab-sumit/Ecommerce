using Notification.Api.Models;
using Notification.Api.Repositories;
using SharedContracts = Shared.Contracts.Notification;

namespace Notification.Api.Services;

public class NotificationService : INotificationService
{
    private readonly INotificationRepository _repository;
    private readonly ILogger<NotificationService> _logger;

    public NotificationService(
        INotificationRepository repository,
        ILogger<NotificationService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<SharedContracts.NotificationResponse> SendAsync(SharedContracts.NotificationRequest request)
    {
        _logger.LogInformation(
            "Sending notification to {Email}",
            request.Email);

        await Task.Delay(500);

        var notification = new NotificationMessage
        {
            CustomerName = request.CustomerName,
            Email = request.Email,
            Subject = request.Subject,
            Message = request.Message,
            SentAt = DateTime.UtcNow
        };

        _repository.Add(notification);

        return new SharedContracts.NotificationResponse
        {
            Success = true,
            Status = "Notification Sent"
        };
    }
}