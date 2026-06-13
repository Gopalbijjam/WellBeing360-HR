using System;

namespace WellBeing360.Core.Entities
{
    public class RecognitionAward
    {
        public int AwardID { get; set; }
        public int NominatorID { get; set; } // Foreign Key to User (Nominator)
        public int RecipientID { get; set; } // Foreign Key to User (Recipient)
        public string Category { get; set; } = string.Empty; // PeerRecognition, ManagerNomination, MilestoneAward, InnovationAward
        public string BadgeName { get; set; } = string.Empty;
        public int PointsAwarded { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime AwardDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Awarded"; // Awarded, Revoked

        // Navigation properties
        public User? Nominator { get; set; }
        public User? Recipient { get; set; }
    }
}
