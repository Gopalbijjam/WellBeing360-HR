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
        private readonly IUnitOfWork _unitOfWork;

        public NotificationManagementService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<Notification>> GetUserNotificationsAsync(int userId)
        {
            var notes = await _unitOfWork.Notifications.FindAsync(n => n.UserID == userId);
            return notes.OrderByDescending(n => n.CreatedDate).ToList();
        }

        public async Task<bool> MarkAsReadAsync(int notificationId)
        {
            var note = await _unitOfWork.Notifications.GetByIdAsync(notificationId);
            if (note == null) return false;

            note.Status = "Read";
            _unitOfWork.Notifications.Update(note);
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
            await _unitOfWork.Notifications.AddAsync(note);
            await _unitOfWork.CompleteAsync();
            return note;
        }
    }
}
