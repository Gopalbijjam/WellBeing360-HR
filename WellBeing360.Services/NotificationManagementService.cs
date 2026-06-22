using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;

namespace WellBeing360.Services
{
    public class NotificationManagementService : INotificationManagementService
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IUnitOfWork _unitOfWork;

        public NotificationManagementService(INotificationRepository notificationRepository, IUnitOfWork unitOfWork)
        {
            _notificationRepository = notificationRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId)
        {
            var notes = await _notificationRepository.GetUserNotificationsAsync(userId);
            return notes.OrderByDescending(n => n.CreatedDate).ToList();
        }

        public async Task<bool> MarkAsReadAsync(int notificationId)
        {
            var note = await _notificationRepository.GetByIdAsync(notificationId);
            if (note == null) return false;

            note.Status = "Read";
            _notificationRepository.Update(note);
            await _unitOfWork.CompleteAsync();
            return true;
        }

        public async Task<Notification> CreateNotificationAsync(int userId, string message, string category)
        {
            var note = new Notification
            {
                UserID = userId,
                Message = message,
                Category = category,
                Status = "Unread",
                CreatedDate = DateTime.UtcNow
            };
            await _notificationRepository.AddAsync(note);
            await _unitOfWork.CompleteAsync();
            return note;
        }
    }
}
