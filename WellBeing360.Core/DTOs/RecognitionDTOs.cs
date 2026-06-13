using System;

namespace WellBeing360.Core.DTOs
{
    public class AwardNominationRequest
    {
        public int RecipientID { get; set; }
        public string Category { get; set; } = string.Empty; // PeerRecognition, ManagerNomination, InnovationAward
        public string BadgeName { get; set; } = string.Empty;
        public int PointsAwarded { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class RecognitionAwardResponse
    {
        public int AwardID { get; set; }
        public string NominatorName { get; set; } = string.Empty;
        public string RecipientName { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string BadgeName { get; set; } = string.Empty;
        public int PointsAwarded { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime AwardDate { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class RedemptionRequest
    {
        public int ItemID { get; set; }
    }
}
