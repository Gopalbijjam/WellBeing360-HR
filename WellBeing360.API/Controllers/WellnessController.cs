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
    public class WellnessController : ControllerBase
    {
        private readonly IWellnessManagementService _wellnessService;

        public WellnessController(IWellnessManagementService wellnessService)
        {
            _wellnessService = wellnessService;
        }

        [HttpGet("programs")]
        public async Task<IActionResult> GetPrograms()
        {
            var programs = await _wellnessService.GetProgramsAsync();
            return Ok(programs);
        }

        [Authorize(Roles = "Admin,WellnessCoordinator")]
        [HttpPost("programs")]
        public async Task<IActionResult> CreateProgram([FromBody] WellnessProgram program)
        {
            var created = await _wellnessService.CreateProgramAsync(program);
            return Ok(created);
        }

        [HttpGet("programs/{programId}/challenges")]
        public async Task<IActionResult> GetChallenges(int programId)
        {
            var challenges = await _wellnessService.GetChallengesAsync(programId);
            return Ok(challenges);
        }

        [Authorize(Roles = "Admin,WellnessCoordinator")]
        [HttpPost("challenges")]
        public async Task<IActionResult> CreateChallenge([FromBody] WellnessChallenge challenge)
        {
            var created = await _wellnessService.CreateChallengeAsync(challenge);
            return Ok(created);
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpPost("log-activity")]
        public async Task<IActionResult> LogActivity([FromHeader(Name = "X-User-Id")] int employeeId, [FromBody] ActivityLogRequest request)
        {
            if (employeeId <= 0) return BadRequest(new { message = "Missing or invalid X-User-Id header." });
            try
            {
                var log = await _wellnessService.LogActivityAsync(employeeId, request);
                return Ok(log);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("my-logs")]
        public async Task<IActionResult> GetMyLogs([FromHeader(Name = "X-User-Id")] int employeeId)
        {
            if (employeeId <= 0) return BadRequest(new { message = "Missing or invalid X-User-Id header." });
            var logs = await _wellnessService.GetEmployeeLogsAsync(employeeId);
            return Ok(logs);
        }

        [HttpGet("programs/{programId}/leaderboard")]
        public async Task<IActionResult> GetLeaderboard(int programId)
        {
            var leaderboard = await _wellnessService.GetLeaderboardAsync(programId);
            return Ok(leaderboard);
        }
    }
}
