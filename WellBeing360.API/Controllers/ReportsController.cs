using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WellBeing360.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace WellBeing360.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly IReportManagementService _reportService;

        public ReportsController(IReportManagementService reportService)
        {
            _reportService = reportService;
        }

        [Authorize(Roles = "Admin,Finance")]
        [HttpGet]
        public async Task<IActionResult> GetReports()
        {
            var reports = await _reportService.GetReportsAsync();
            return Ok(reports);
        }

        [Authorize(Roles = "Admin,Finance")]
        [HttpPost("generate")]
        public async Task<IActionResult> GenerateReport([FromQuery] string scope = "Company")
        {
            var report = await _reportService.GenerateReportAsync(scope);
            return Ok(report);
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("audit")]
        public async Task<IActionResult> GetAuditLogs()
        {
            var logs = await _reportService.GetAuditLogsAsync();
            return Ok(logs);
        }
    }
}
