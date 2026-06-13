using System;

namespace WellBeing360.Core.Entities
{
    public class Notification
    {
        public int NotificationID { get; set; }
        public int UserID { get; set; } // Foreign Key to User
        public string Message { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty; // Enrolment, Wellness, EAP, Recognition, Benefits
        public string Status { get; set; } = "Unread"; // Unread, Read, Dismissed
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Navigation property
        public User? User { get; set; }
    }
}
