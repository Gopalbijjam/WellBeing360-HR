using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using WellBeing360.Core.DTOs;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace WellBeing360.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class EAPController : ControllerBase
    {
        private readonly IEapManagementService _eapService;

        public EAPController(IEapManagementService eapService)
        {
            _eapService = eapService;
        }

        [HttpGet("services")]
        public async Task<IActionResult> GetServices()
        {
            var services = await _eapService.GetServicesAsync();
            return Ok(services);
        }

        [Authorize(Roles = "Admin,HRBenefitsAdmin,WellnessCoordinator")]
        [HttpPost("services")]
        public async Task<IActionResult> CreateService([FromBody] EAPService service)
        {
            var created = await _eapService.CreateServiceAsync(service);
            return Ok(created);
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpPost("book")]
        public async Task<IActionResult> Book([FromHeader(Name = "X-User-Id")] int employeeId, [FromBody] EAPBookingRequest request)
        {
            if (employeeId <= 0) return BadRequest(new { message = "Missing or invalid X-User-Id header." });
            try
            {
                var session = await _eapService.BookSessionAsync(employeeId, request);
                return Ok(session);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("my-sessions")]
        public async Task<IActionResult> GetMySessions([FromHeader(Name = "X-User-Id")] int employeeId)
        {
            if (employeeId <= 0) return BadRequest(new { message = "Missing or invalid X-User-Id header." });
            var sessions = await _eapService.GetEmployeeSessionsAsync(employeeId);
            return Ok(sessions);
        }

        [Authorize(Roles = "Admin,HRBenefitsAdmin,WellnessCoordinator,Finance")]
        [HttpGet("sessions")]
        public async Task<IActionResult> GetAllSessions()
        {
            var sessions = await _eapService.GetAllSessionsAsync();
            return Ok(sessions);
        }

        public class UpdateSessionStatusModel
        {
            public string Status { get; set; } = string.Empty;
            public string CounsellorRef { get; set; } = string.Empty;
        }

        [Authorize(Roles = "Admin,HRBenefitsAdmin,WellnessCoordinator")]
        [HttpPut("sessions/{id}/status")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateSessionStatusModel model)
        {
            var updated = await _eapService.UpdateSessionStatusAsync(id, model.Status, model.CounsellorRef);
            if (updated == null) return NotFound();
            return Ok(updated);
        }
    }
}
