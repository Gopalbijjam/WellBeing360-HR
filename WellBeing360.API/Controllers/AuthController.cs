using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using WellBeing360.Core.DTOs;
using WellBeing360.Core.Interfaces;

namespace WellBeing360.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserManagementService _userService;
        private readonly IConfiguration _configuration;

        public AuthController(IUserManagementService userService, IConfiguration configuration)
        {
            _userService = userService;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var response = await _userService.LoginAsync(request);
            if (response == null)
            {
                return Unauthorized(new { message = "Invalid email, password, or user account is inactive." });
            }

            response.Token = GenerateJwtToken(response);
            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest(new { message = "Name, email, and password are required fields." });
            }

            var registeredUser = await _userService.RegisterAsync(request);
            if (registeredUser == null)
            {
                return BadRequest(new { message = "Email is already in use." });
            }

            return CreatedAtAction(nameof(Register), new { email = registeredUser.Email }, new {
                message = "Registration successful",
                userId = registeredUser.UserID,
                employeeId = registeredUser.EmployeeID,
                name = registeredUser.Name,
                email = registeredUser.Email,
                role = registeredUser.Role,
                gradeId = registeredUser.GradeID,
                departmentId = registeredUser.DepartmentID
            });
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetDemoUsers()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        private string GenerateJwtToken(LoginResponse user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtKey = _configuration["Jwt:Key"] ?? "SuperSecretKeyForWellBeing360TokenGenerationSecretsShouldBeLongEnough2026";
            var jwtIssuer = _configuration["Jwt:Issuer"] ?? "WellBeing360";
            var jwtAudience = _configuration["Jwt:Audience"] ?? "WellBeing360Users";
            var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.UserID.ToString()),
                    new Claim(ClaimTypes.Name, user.Name),
                    new Claim(ClaimTypes.Role, user.Role),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim("employeeId", user.EmployeeID),
                    new Claim("gradeId", user.GradeID),
                    new Claim("departmentId", user.DepartmentID)
                }),
                Expires = DateTime.UtcNow.AddMinutes(double.Parse(_configuration["Jwt:DurationInMinutes"] ?? "60")),
                Issuer = jwtIssuer,
                Audience = jwtAudience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
