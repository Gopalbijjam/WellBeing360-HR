using Microsoft.AspNetCore.Http;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using WellBeing360.Core.Entities;
using WellBeing360.Core.Interfaces;

namespace WellBeing360.API.Middleware
{
    public class AuditLoggingMiddleware
    {
        private readonly RequestDelegate _next;

        public AuditLoggingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, IUnitOfWork unitOfWork)
        {
            // Capture request details before processing if needed,
            // but we log after successful processing (status 2xx/3xx)
            var path = context.Request.Path.Value ?? "";
            var method = context.Request.Method;

            await _next(context);

            var statusCode = context.Response.StatusCode;

            // Only log successful write operations on APIs
            if (path.StartsWith("/api/", StringComparison.OrdinalIgnoreCase) && 
                (method == "POST" || method == "PUT" || method == "DELETE") &&
                statusCode >= 200 && statusCode < 400)
            {
                // Attempt to get UserID from X-User-Id header or JWT Claims
                int userId = 0;
                if (context.Request.Headers.TryGetValue("X-User-Id", out var headerUserId) && 
                    int.TryParse(headerUserId, out var parsedHeaderId))
                {
                    userId = parsedHeaderId;
                }
                else if (context.User?.Identity?.IsAuthenticated == true)
                {
                    var nameIdentifier = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                    int.TryParse(nameIdentifier, out userId);
                }

                if (userId > 0)
                {
                    // Deduce module from path e.g. /api/enrolments -> Enrolments
                    var segments = path.Split('/', StringSplitOptions.RemoveEmptyEntries);
                    string module = segments.Length > 1 ? segments[1] : "General";

                    // Capitalize module name
                    if (!string.IsNullOrEmpty(module))
                    {
                        module = char.ToUpper(module[0]) + module.Substring(1);
                    }

                    var auditLog = new AuditLog
                    {
                        UserID = userId,
                        Action = $"{method} request to {path} (Status: {statusCode})",
                        Module = module,
                        Timestamp = DateTime.UtcNow
                    };

                    await unitOfWork.AuditLogs.AddAsync(auditLog);
                    await unitOfWork.CompleteAsync();
                }
            }
        }
    }
}
