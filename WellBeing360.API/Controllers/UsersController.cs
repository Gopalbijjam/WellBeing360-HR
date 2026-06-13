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
    public class UsersController : ControllerBase
    {
        private readonly IUserManagementService _userService;

        public UsersController(IUserManagementService userService)
        {
            _userService = userService;
        }

        [Authorize(Roles = "Admin,HRBenefitsAdmin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [Authorize(Roles = "Admin,HRBenefitsAdmin")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] User user)
        {
            var created = await _userService.CreateUserAsync(user);
            return CreatedAtAction(nameof(GetById), new { id = created.UserID }, created);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] User user)
        {
            var updated = await _userService.UpdateUserAsync(id, user);
            if (updated == null) return NotFound();
            return Ok(updated);
        }
    }
}
