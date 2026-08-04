using Notification.Api.Models;

namespace Notification.Api.Services;

public interface INotificationService
{
    Task<NotificationResponse> SendAsync(NotificationRequest request);
}