using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace WellBeing360.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BenefitPlansController : ControllerBase
    {
        private readonly IBenefitManagementService _benefitService;

        public BenefitPlansController(IBenefitManagementService benefitService)
        {
            _benefitService = benefitService;
        }

        [HttpGet]
        public async Task<IActionResult> GetPlans()
        {
            var plans = await _benefitService.GetPlansAsync();
            return Ok(plans);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPlan(int id)
        {
            var plan = await _benefitService.GetPlanByIdAsync(id);
            if (plan == null) return NotFound();
            return Ok(plan);
        }

        [Authorize(Roles = "Admin,HRBenefitsAdmin")]
        [HttpPost]
        public async Task<IActionResult> CreatePlan([FromBody] BenefitPlan plan)
        {
            var created = await _benefitService.CreatePlanAsync(plan);
            return CreatedAtAction(nameof(GetPlan), new { id = created.PlanID }, created);
        }

        [HttpGet("{id}/buckets")]
        public async Task<IActionResult> GetBuckets(int id)
        {
            var buckets = await _benefitService.GetFlexBucketsAsync(id);
            return Ok(buckets);
        }

        [Authorize(Roles = "Admin,Finance")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdatePlanStatus(int id, [FromBody] StatusUpdateRequest request)
        {
            var updated = await _benefitService.UpdatePlanStatusAsync(id, request.Status);
            if (updated == null) return NotFound();
            return Ok(updated);
        }
    }

    public class StatusUpdateRequest
    {
        public string Status { get; set; } = string.Empty;
    }
}
