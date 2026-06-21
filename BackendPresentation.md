# WellBeing360 – Backend Deep‑Dive Presentation (30 min)

---

## 🎯 Goal of the Presentation
- Explain the **backend implementation** of WellBeing360.
- Highlight **key code locations** and the **business flow** for modules 4.4 (Wellness) and 4.6 (Recognition).
- Provide **point‑man bullet points** you can read aloud during a 30‑minute interview.
- Cover **why Swagger UI might not be visible** and how to fix it.

---

## 1️⃣ Backend Architecture Snapshot (≈ 5 min)
| Layer | Project | Core Responsibility | Important Files |
|-------|---------|--------------------|-----------------|
| **API Gateway** | `WellBeing360.API` | ASP.NET Core Web API, routing, authentication, Swagger UI | `Program.cs`, Controllers (`WellnessController.cs`, `RecognitionController.cs`) |
| **Domain / Core** | `WellBeing360.Core` | POCO DTOs, entity definitions, service/repository interfaces | `DTOs/*DTOs.cs` (e.g., `AuthDTOs.cs`), `Interfaces/*Interface.cs` |
| **Application Services** | `WellBeing360.Services` | Business logic for Wellness, Recognition, Points | `WellnessService.cs`, `RecognitionService.cs`, `PointService.cs` |
| **Infrastructure** | `WellBeing360.Infrastructure` | EF Core `DbContext`, concrete repositories, migrations | `AppDbContext.cs`, `Repositories/*Repository.cs` |
| **Testing** | `WellBeing360.Tests` | Unit & integration tests | `WellBeing360.Tests/*.cs` |

All projects target **`.NET 10.0`** (`<TargetFramework>net10.0</TargetFramework>`). The solution follows a **layered, clean‑architecture** approach – UI never talks directly to EF; it always goes through services and interfaces.

---

## 2️⃣ Core Code Walk‑Through (≈ 12 min)
### 2.1 Program.cs – Application bootstrap
```csharp
var builder = WebApplication.CreateBuilder(args);

// CORS – allow any origin for demo purposes
builder.Services.AddCors(o => o.AddPolicy("AllowAll", p => p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

// Controllers & JSON options (ignore cycles, camelCase)
builder.Services.AddControllers()
    .AddJsonOptions(o => {
        o.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        o.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
    });

// DB context (SQL Server, migrations in Infrastructure)
var conn = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<WellBeingContext>(opt => opt.UseSqlServer(conn, b => b.MigrationsAssembly("WellBeing360.Infrastructure")));

// JWT authentication (key, issuer, audience from config)
var jwtKey = builder.Configuration["Jwt:Key"] ?? "SuperSecretKey...2026";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "WellBeing360";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "WellBeing360Users";
var keyBytes = Encoding.UTF8.GetBytes(jwtKey);

builder.Services.AddAuthentication(o => {
    o.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    o.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(o => {
    o.TokenValidationParameters = new TokenValidationParameters {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(keyBytes)
    };
});

// DI – services & repositories (scoped)
builder.Services.AddScoped<IWellnessService, WellnessService>();
builder.Services.AddScoped<IRecognitionService, RecognitionService>();
builder.Services.AddScoped<IPointService, PointService>();
// …more services omitted for brevity

var app = builder.Build();

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();
app.UseSwagger();
app.UseSwaggerUI(c => {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "WellBeing360 API v1");
    c.RoutePrefix = "swagger";
});
app.MapControllers();
app.Run();
```
**Key take‑aways**
- All **services are registered as Scoped** – a fresh instance per request.
- JWT middleware validates the token on every protected endpoint.
- **Swagger** is added **unconditionally**, so it should be reachable at `/swagger`.

### 2.2 Controllers (thin routing layer)
#### WellnessController.cs (module 4.4)
```csharp
[ApiController]
[Route("api/wellness")]
[Authorize]
public class WellnessController : ControllerBase {
    private readonly IWellnessService _svc;
    public WellnessController(IWellnessService svc) => _svc = svc;

    [HttpGet("programs")]
    public async Task<ActionResult<IEnumerable<WellnessProgramDto>>> GetPrograms()
        => Ok(await _svc.GetProgramsAsync());

    [HttpPost("log-activity")]
    public async Task<ActionResult> LogActivity([FromBody] LogActivityDto dto) {
        await _svc.LogActivityAsync(UserIdFromHeader, dto.ChallengeId, dto.Value);
        return NoContent();
    }

    [HttpGet("programs/{id}/leaderboard")]
    public async Task<ActionResult<IEnumerable<LeaderboardEntryDto>>> Leaderboard(int id)
        => Ok(await _svc.GetLeaderboardAsync(id));
}
```
- **Only forwards** to the service layer – no business logic here.
- Relies on **`UserIdFromHeader`** that the middleware injects from the JWT.

#### RecognitionController.cs (module 4.6)
```csharp
[ApiController]
[Route("api/recognition")]
[Authorize]
public class RecognitionController : ControllerBase {
    private readonly IRecognitionService _svc;
    public RecognitionController(IRecognitionService svc) => _svc = svc;

    [HttpPost("nominate")]
    public async Task<ActionResult> Nominate([FromBody] NominateDto dto) {
        await _svc.NominateAsync(UserIdFromHeader, dto.RecipientId, dto.Title, dto.Points);
        return Ok();
    }

    [HttpGet("my-awards/received")]
    public async Task<ActionResult<IEnumerable<AwardDto>>> MyReceived()
        => Ok(await _svc.GetMyAwardsAsync(UserIdFromHeader, sent: false));
}
```
- Mirrors the **wellness flow** but operates on the **point ledger**.

### 2.3 Services – Business Logic (≈ 10 min)
#### WellnessService.cs (module 4.4)
```csharp
public class WellnessService : IWellnessService {
    private readonly IWellnessRepository _repo;
    private readonly IPointService _points;

    public WellnessService(IWellnessRepository repo, IPointService points) { _repo = repo; _points = points; }

    public async Task LogActivityAsync(int userId, int challengeId, int value) {
        var chal = await _repo.GetChallengeAsync(challengeId) ?? throw new NotFoundException("Challenge");
        // Persist activity
        await _repo.AddActivityLogAsync(new ActivityLog { UserId = userId, ChallengeId = challengeId, Value = value, LoggedAt = DateTime.UtcNow });
        // Credit points based on the challenge definition
        await _points.CreditAsync(userId, chal.PointsReward, $"Completed '{chal.Title}'");
    }

    public async Task<IEnumerable<LeaderboardEntry>> GetLeaderboardAsync(int programId) {
        return await _repo.QueryActivityLogs()
            .Where(a => a.Challenge.ProgramId == programId)
            .GroupBy(a => a.UserId)
            .Select(g => new LeaderboardEntry { UserId = g.Key, TotalPoints = g.Sum(a => a.Challenge.PointsReward) })
            .OrderByDescending(e => e.TotalPoints)
            .Take(10)
            .ToListAsync();
    }
}
```
- **Validation** (challenge existence, active period) lives here.
- **Points** are awarded via the **shared `PointService`**.
- **Leaderboard** is a **single SQL aggregation** – performant even with many rows.

#### RecognitionService.cs (module 4.6)
```csharp
public class RecognitionService : IRecognitionService {
    private readonly IRecognitionRepository _repo;
    private readonly IPointService _points;

    public RecognitionService(IRecognitionRepository repo, IPointService points) { _repo = repo; _points = points; }

    public async Task NominateAsync(int nominatorId, int recipientId, string title, int points) {
        if (nominatorId == recipientId) throw new BusinessException("Cannot nominate yourself");
        var balance = await _points.GetBalanceAsync(nominatorId);
        if (balance < points) throw new BusinessException("Insufficient points");
        // Transaction ensures both debit & credit succeed together
        await using var tx = await _repo.Context.Database.BeginTransactionAsync();
        await _points.DebitAsync(nominatorId, points, $"Nominate {title}");
        await _points.CreditAsync(recipientId, points, $"Awarded for {title}");
        await _repo.AddAwardAsync(new Award { NominatorId = nominatorId, RecipientId = recipientId, Title = title, PointsAwarded = points, CreatedAt = DateTime.UtcNow });
        await tx.CommitAsync();
    }
}
```
- **Transactional integrity** – both debit and credit happen atomically.
- Uses the **same `PointService`** as the wellness module, ensuring a **single source of truth** for points.

#### PointService.cs (shared ledger)
```csharp
public class PointService : IPointService {
    private readonly AppDbContext _ctx;
    public PointService(AppDbContext ctx) => _ctx = ctx;
    public async Task<int> GetBalanceAsync(int userId) =>
        await _ctx.PointTransactions.Where(p => p.UserId == userId).SumAsync(p => p.Amount);
    public async Task CreditAsync(int userId, int amount, string desc) {
        _ctx.PointTransactions.Add(new PointTransaction { UserId = userId, Amount = amount, Description = desc, CreatedAt = DateTime.UtcNow });
        await _ctx.SaveChangesAsync();
    }
    public async Task DebitAsync(int userId, int amount, string desc) => await CreditAsync(userId, -amount, desc);
}
```
- Every point movement creates a **`PointTransaction`** row – perfect for audits.

### 2.4 Repository Layer (quick glance)
- **`WellnessRepository`**, **`RecognitionRepository`**, **`UserRepository`** implement **CRUD** and expose **IQueryable** for efficient queries.
- Example: `QueryActivityLogs()` returns `IQueryable<ActivityLog>` so services can compose LINQ queries (used for the leaderboard).

---

## 3️⃣ Point‑Man Bullet List (≈ 5 min) – what to say verbatim
> Use these as talking‑points; each can be expanded with a quick code‑snippet reference.

1. **Layered Clean Architecture** – UI → Controllers → Services → Repositories → EF Core.
2. **All projects target .NET 10** – modern runtime, tiered JIT, ready for AOT.
3. **Dependency Injection** – every service/repo is registered as Scoped, enabling unit‑test mocking.
4. **JWT‑based security** – stateless, claims contain `sub` (userId) used by middleware to inject `X‑User‑Id` header.
5. **Wellness flow** – activity logged → points automatically credited → leaderboard aggregated in‑DB.
6. **Recognition flow** – nomination validates balance → debit nominator → credit recipient → award persisted in a single transaction.
7. **Single Point Ledger** – `PointTransaction` stores every credit/debit; `PointService` provides balance, credit, debit.
8. **Transactional safety** – `RecognitionService` uses EF Core transaction; any failure rolls back both debit and credit.
9. **Swagger UI** – automatically generated from controller annotations; reachable at `http://localhost:5201/swagger`.
10. **Why Swagger might be missing** – most common culprits:
    - Opening **HTTPS** when `UseHttpsRedirection` is disabled → 404.
    - Wrong **port** – the API listens on **5201**; Swagger lives under `/swagger`.
    - `RoutePrefix` changed from the default – ensure `c.RoutePrefix = "swagger"` in `Program.cs`.
    - Middleware order – `UseSwagger`/`UseSwaggerUI` must be called **before** `MapControllers()` (it is).
11. **Testing strategy** – unit tests for services (mock repositories), integration tests for controllers (in‑memory DB), and end‑to‑end calls via Swagger or Postman.

---

## 4️⃣ Swagger Troubleshooting Recap (≈ 3 min)
1. **Verify URL** – `http://localhost:5201/swagger` (not HTTPS).
2. **Check launchSettings.json** – `applicationUrl` must match the port the server is listening on.
3. **RoutePrefix** – ensure it is set to `"swagger"` (default). If changed, adjust the URL accordingly.
4. **Middleware order** – `app.UseSwagger(); app.UseSwaggerUI();` must appear **before** `app.MapControllers();`.
5. **Console output** – after `dotnet run` you should see `Now listening on: http://localhost:5201`. If you see a different URL, use that.
6. **Network** – ensure you are accessing the API from the same machine; firewall or remote RDP can block the request.

---

## 5️⃣ Demo Script (quick live demo, ~5 min)
```bash
# Register test user (once)
curl -X POST http://localhost:5201/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test.user@example.com","password":"P@ssw0rd123!","phone":"555-0101","role":"Employee","gradeId":"G1","departmentId":"IT"}'

# Login – capture JWT
TOKEN=$(curl -s -X POST http://localhost:5201/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test.user@example.com","password":"P@ssw0rd123!"}' | jq -r .token)

echo "JWT: $TOKEN"

# Wellness – log activity (challenge 5)
curl -X POST http://localhost:5201/api/wellness/log-activity \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"challengeId":5,"value":12000}'

# Wellness – view leaderboard for program 1
curl -X GET http://localhost:5201/api/wellness/programs/1/leaderboard \
  -H "Authorization: Bearer $TOKEN"

# Recognition – nominate a colleague (recipientId 23)
curl -X POST http://localhost:5201/api/recognition/nominate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"recipientId":23,"title":"Great teamwork","points":15}'

# Recognition – list received awards (as recipient) – repeat login with their credentials if needed
curl -X GET http://localhost:5201/api/recognition/my-awards/received \
  -H "Authorization: Bearer $TOKEN"
```
- Walk the interviewer through the **request → service → DB** flow for each call.
- Show the **point ledger** by inspecting the `PointTransactions` table (optional).

---

## 6️⃣ Closing – What to Emphasize
- **Single source of truth** for points (ledger) guarantees auditability.
- **Transactional consistency** prevents half‑finished operations.
- **Modular design** makes it trivial to add new modules (e.g., gamification) without touching existing services.
- **Swagger** provides instant API documentation – just ensure the correct URL/port.

---

*Save this file as `BackendPresentation.md` and open it in any markdown viewer before the interview. Use the bullet list and demo script to keep the session within 30 minutes while showing code, architecture, and live API calls.*
