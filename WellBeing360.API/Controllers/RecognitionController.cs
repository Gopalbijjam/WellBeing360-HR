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
    public class RecognitionController : ControllerBase
    {
        private readonly IRecognitionManagementService _recService;

        public RecognitionController(IRecognitionManagementService recService)
        {
            _recService = recService;
        }

        [HttpPost("nominate")]
        public async Task<IActionResult> Nominate([FromHeader(Name = "X-User-Id")] int nominatorId, [FromBody] AwardNominationRequest request)
        {
            if (nominatorId <= 0) return BadRequest(new { message = "Missing or invalid X-User-Id header." });
            try
            {
                var award = await _recService.NominateAwardAsync(nominatorId, request);
                return Ok(award);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("my-awards/received")]
        public async Task<IActionResult> GetMyReceived([FromHeader(Name = "X-User-Id")] int employeeId)
        {
            if (employeeId <= 0) return BadRequest(new { message = "Missing or invalid X-User-Id header." });
            var awards = await _recService.GetAwardsReceivedAsync(employeeId);
            return Ok(awards);
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("my-awards/sent")]
        public async Task<IActionResult> GetMySent([FromHeader(Name = "X-User-Id")] int employeeId)
        {
            if (employeeId <= 0) return BadRequest(new { message = "Missing or invalid X-User-Id header." });
            var awards = await _recService.GetAwardsSentAsync(employeeId);
            return Ok(awards);
        }

        [Authorize(Roles = "Admin,RecognitionManager")]
        [HttpGet("awards")]
        public async Task<IActionResult> GetAllAwards()
        {
            var awards = await _recService.GetAllAwardsAsync();
            return Ok(awards);
        }

        [Authorize(Roles = "Admin,RecognitionManager")]
        [HttpGet("points")]
        public async Task<IActionResult> GetAllPoints()
        {
            var points = await _recService.GetAllPointsBalancesAsync();
            return Ok(points);
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("my-points")]
        public async Task<IActionResult> GetMyPoints([FromHeader(Name = "X-User-Id")] int employeeId)
        {
            if (employeeId <= 0) return BadRequest(new { message = "Missing or invalid X-User-Id header." });
            var points = await _recService.GetPointsBalanceAsync(employeeId);
            if (points == null)
            {
                return Ok(new { pointsID = 0, employeeID = employeeId, totalEarned = 0, totalRedeemed = 0, balance = 0, lastUpdated = DateTime.UtcNow });
            }
            return Ok(points);
        }

        [HttpGet("catalog")]
        public async Task<IActionResult> GetCatalog()
        {
            var catalog = await _recService.GetCatalogAsync();
            return Ok(catalog);
        }

        [Authorize(Roles = "Admin,RecognitionManager")]
        [HttpPost("catalog")]
        public async Task<IActionResult> CreateCatalogItem([FromBody] RedemptionCatalog item)
        {
            var created = await _recService.CreateCatalogItemAsync(item);
            return Ok(created);
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpPost("redeem")]
        public async Task<IActionResult> Redeem([FromHeader(Name = "X-User-Id")] int employeeId, [FromBody] RedemptionRequest request)
        {
            if (employeeId <= 0) return BadRequest(new { message = "Missing or invalid X-User-Id header." });
            try
            {
                var success = await _recService.RedeemItemAsync(employeeId, request.ItemID);
                return Ok(new { success = success, message = "Item successfully redeemed." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
