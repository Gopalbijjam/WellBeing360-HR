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
    public class EnrolmentsController : ControllerBase
    {
        private readonly IBenefitManagementService _benefitService;

        public EnrolmentsController(IBenefitManagementService benefitService)
        {
            _benefitService = benefitService;
        }

        [HttpGet("windows")]
        public async Task<IActionResult> GetWindows()
        {
            var windows = await _benefitService.GetEnrolmentWindowsAsync();
            return Ok(windows);
        }

        [HttpGet("windows/current")]
        public async Task<IActionResult> GetCurrentWindow()
        {
            var window = await _benefitService.GetCurrentOpenWindowAsync();
            if (window == null) return NotFound(new { message = "No open enrolment windows found." });
            return Ok(window);
        }

        [Authorize(Roles = "Admin,HRBenefitsAdmin")]
        [HttpPost("windows")]
        public async Task<IActionResult> CreateWindow([FromBody] EnrolmentWindow window)
        {
            var created = await _benefitService.CreateEnrolmentWindowAsync(window);
            return Ok(created);
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpPost("enrol")]
        public async Task<IActionResult> Enrol([FromHeader(Name = "X-User-Id")] int employeeId, [FromBody] EnrolmentRequest request)
        {
            if (employeeId <= 0) return BadRequest(new { message = "Missing or invalid X-User-Id header." });
            try
            {
                var enrolment = await _benefitService.EnrolEmployeeAsync(employeeId, request);
                if (enrolment == null) return BadRequest(new { message = "Enrolment failed. Plan or window is inactive." });
                return Ok(enrolment);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("my-enrolments")]
        public async Task<IActionResult> GetMyEnrolments([FromHeader(Name = "X-User-Id")] int employeeId)
        {
            if (employeeId <= 0) return BadRequest(new { message = "Missing or invalid X-User-Id header." });
            var enrolments = await _benefitService.GetEmployeeEnrolmentsAsync(employeeId);
            return Ok(enrolments);
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("my-dependents")]
        public async Task<IActionResult> GetMyDependents([FromHeader(Name = "X-User-Id")] int employeeId)
        {
            if (employeeId <= 0) return BadRequest(new { message = "Missing or invalid X-User-Id header." });
            var dependents = await _benefitService.GetDependentsAsync(employeeId);
            return Ok(dependents);
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpPost("my-dependents")]
        public async Task<IActionResult> AddDependent([FromHeader(Name = "X-User-Id")] int employeeId, [FromBody] DependentDTO dependent)
        {
            if (employeeId <= 0) return BadRequest(new { message = "Missing or invalid X-User-Id header." });
            var created = await _benefitService.AddDependentAsync(employeeId, dependent);
            return Ok(created);
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpDelete("dependents/{id}")]
        public async Task<IActionResult> RemoveDependent(int id)
        {
            var success = await _benefitService.RemoveDependentAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }

        [Authorize(Roles = "Admin,HRBenefitsAdmin,Finance")]
        [HttpGet("all-enrolments")]
        public async Task<IActionResult> GetAllEnrolments()
        {
            var enrolments = await _benefitService.GetAllEnrolmentsAsync();
            return Ok(enrolments);
        }

        [Authorize(Roles = "Admin,Finance")]
        [HttpPut("{enrolmentId}/status")]
        public async Task<IActionResult> UpdateEnrolmentStatus(int enrolmentId, [FromBody] StatusUpdateRequest request)
        {
            var updated = await _benefitService.UpdateEnrolmentStatusAsync(enrolmentId, request.Status);
            if (updated == null) return NotFound();
            return Ok(updated);
        }
    }
}
