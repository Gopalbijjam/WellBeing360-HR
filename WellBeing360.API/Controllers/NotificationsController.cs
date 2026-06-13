using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using WellBeing360.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace WellBeing360.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationManagementService _noteService;

        public NotificationsController(INotificationManagementService noteService)
        {
            _noteService = noteService;
        }

        [HttpGet]
        public async Task<IActionResult> GetMyNotifications([FromHeader(Name = "X-User-Id")] int userId)
        {
            if (userId <= 0) return BadRequest(new { message = "Missing or invalid X-User-Id header." });
            var notes = await _noteService.GetUserNotificationsAsync(userId);
            return Ok(notes);
        }

        [HttpPut("{id}/read")]
        public async Task<IActionResult> MarkRead(int id)
        {
            var success = await _noteService.MarkAsReadAsync(id);
            if (!success) return NotFound();
            return NoContent();
        }
    }
}
