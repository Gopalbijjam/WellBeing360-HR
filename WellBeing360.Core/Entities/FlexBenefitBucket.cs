namespace WellBeing360.Core.Entities
{
    public class FlexBenefitBucket
    {
        public int BucketID { get; set; }
        public int PlanID { get; set; }
        public string BucketName { get; set; } = string.Empty; // Medical, Childcare, Fitness, Education, Transport, Meal
        public decimal AnnualAllowance { get; set; }
        public bool CarryForwardAllowed { get; set; }
        public string Status { get; set; } = "Active"; // Active, Inactive

        // Navigation property
        public BenefitPlan? BenefitPlan { get; set; }
    }
}
