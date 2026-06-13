using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WellBeing360.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BenefitPlans",
                columns: table => new
                {
                    PlanID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlanName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PlanType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EligibilityGrade = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EmployeeContribution = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    EmployerContribution = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CoverageLimit = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    EffectiveDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BenefitPlans", x => x.PlanID);
                });

            migrationBuilder.CreateTable(
                name: "BenefitsReports",
                columns: table => new
                {
                    ReportID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Scope = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Metrics = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GeneratedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BenefitsReports", x => x.ReportID);
                });

            migrationBuilder.CreateTable(
                name: "EAPServices",
                columns: table => new
                {
                    ServiceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ServiceName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SessionsAllowedPerEmployee = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EAPServices", x => x.ServiceID);
                });

            migrationBuilder.CreateTable(
                name: "EnrolmentWindows",
                columns: table => new
                {
                    WindowID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlanYear = table.Column<int>(type: "int", nullable: false),
                    OpenDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CloseDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EligibleGrades = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnrolmentWindows", x => x.WindowID);
                });

            migrationBuilder.CreateTable(
                name: "RedemptionCatalogs",
                columns: table => new
                {
                    ItemID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ItemName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PointsRequired = table.Column<int>(type: "int", nullable: false),
                    AvailableQuantity = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RedemptionCatalogs", x => x.ItemID);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeID = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GradeID = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DepartmentID = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserID);
                });

            migrationBuilder.CreateTable(
                name: "WellnessPrograms",
                columns: table => new
                {
                    ProgramID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Theme = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    StartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PointsOnOffer = table.Column<int>(type: "int", nullable: false),
                    TargetParticipation = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WellnessPrograms", x => x.ProgramID);
                });

            migrationBuilder.CreateTable(
                name: "FlexBenefitBuckets",
                columns: table => new
                {
                    BucketID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlanID = table.Column<int>(type: "int", nullable: false),
                    BucketName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AnnualAllowance = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CarryForwardAllowed = table.Column<bool>(type: "bit", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FlexBenefitBuckets", x => x.BucketID);
                    table.ForeignKey(
                        name: "FK_FlexBenefitBuckets_BenefitPlans_PlanID",
                        column: x => x.PlanID,
                        principalTable: "BenefitPlans",
                        principalColumn: "PlanID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AuditLogs",
                columns: table => new
                {
                    AuditID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    Action = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Module = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLogs", x => x.AuditID);
                    table.ForeignKey(
                        name: "FK_AuditLogs_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "BenefitEnrolments",
                columns: table => new
                {
                    EnrolmentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeID = table.Column<int>(type: "int", nullable: false),
                    PlanID = table.Column<int>(type: "int", nullable: false),
                    WindowID = table.Column<int>(type: "int", nullable: false),
                    CoverageOption = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DependentsIncluded = table.Column<bool>(type: "bit", nullable: false),
                    EmployeeContributionAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    EffectiveDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BenefitEnrolments", x => x.EnrolmentID);
                    table.ForeignKey(
                        name: "FK_BenefitEnrolments_BenefitPlans_PlanID",
                        column: x => x.PlanID,
                        principalTable: "BenefitPlans",
                        principalColumn: "PlanID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BenefitEnrolments_EnrolmentWindows_WindowID",
                        column: x => x.WindowID,
                        principalTable: "EnrolmentWindows",
                        principalColumn: "WindowID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_BenefitEnrolments_Users_EmployeeID",
                        column: x => x.EmployeeID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Dependents",
                columns: table => new
                {
                    DependentID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeID = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Relationship = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DateOfBirth = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dependents", x => x.DependentID);
                    table.ForeignKey(
                        name: "FK_Dependents_Users_EmployeeID",
                        column: x => x.EmployeeID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "EAPSessions",
                columns: table => new
                {
                    SessionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeID = table.Column<int>(type: "int", nullable: false),
                    ServiceID = table.Column<int>(type: "int", nullable: false),
                    RequestedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    SessionDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CounsellorRef = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EAPSessions", x => x.SessionID);
                    table.ForeignKey(
                        name: "FK_EAPSessions_EAPServices_ServiceID",
                        column: x => x.ServiceID,
                        principalTable: "EAPServices",
                        principalColumn: "ServiceID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_EAPSessions_Users_EmployeeID",
                        column: x => x.EmployeeID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    NotificationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.NotificationID);
                    table.ForeignKey(
                        name: "FK_Notifications_Users_UserID",
                        column: x => x.UserID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RecognitionAwards",
                columns: table => new
                {
                    AwardID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NominatorID = table.Column<int>(type: "int", nullable: false),
                    RecipientID = table.Column<int>(type: "int", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    BadgeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PointsAwarded = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    AwardDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecognitionAwards", x => x.AwardID);
                    table.ForeignKey(
                        name: "FK_RecognitionAwards_Users_NominatorID",
                        column: x => x.NominatorID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_RecognitionAwards_Users_RecipientID",
                        column: x => x.RecipientID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "RewardPoints",
                columns: table => new
                {
                    PointsID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeID = table.Column<int>(type: "int", nullable: false),
                    TotalEarned = table.Column<int>(type: "int", nullable: false),
                    TotalRedeemed = table.Column<int>(type: "int", nullable: false),
                    Balance = table.Column<int>(type: "int", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RewardPoints", x => x.PointsID);
                    table.ForeignKey(
                        name: "FK_RewardPoints_Users_EmployeeID",
                        column: x => x.EmployeeID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WellnessChallenges",
                columns: table => new
                {
                    ChallengeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ProgramID = table.Column<int>(type: "int", nullable: false),
                    ChallengeName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ActivityType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DailyTarget = table.Column<int>(type: "int", nullable: false),
                    Duration = table.Column<int>(type: "int", nullable: false),
                    PointsPerCompletion = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WellnessChallenges", x => x.ChallengeID);
                    table.ForeignKey(
                        name: "FK_WellnessChallenges_WellnessPrograms_ProgramID",
                        column: x => x.ProgramID,
                        principalTable: "WellnessPrograms",
                        principalColumn: "ProgramID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ActivityLogs",
                columns: table => new
                {
                    LogID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ChallengeID = table.Column<int>(type: "int", nullable: false),
                    EmployeeID = table.Column<int>(type: "int", nullable: false),
                    LogDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ActivityValue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PointsEarned = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityLogs", x => x.LogID);
                    table.ForeignKey(
                        name: "FK_ActivityLogs_Users_EmployeeID",
                        column: x => x.EmployeeID,
                        principalTable: "Users",
                        principalColumn: "UserID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ActivityLogs_WellnessChallenges_ChallengeID",
                        column: x => x.ChallengeID,
                        principalTable: "WellnessChallenges",
                        principalColumn: "ChallengeID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ActivityLogs_ChallengeID",
                table: "ActivityLogs",
                column: "ChallengeID");

            migrationBuilder.CreateIndex(
                name: "IX_ActivityLogs_EmployeeID",
                table: "ActivityLogs",
                column: "EmployeeID");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_UserID",
                table: "AuditLogs",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_BenefitEnrolments_EmployeeID",
                table: "BenefitEnrolments",
                column: "EmployeeID");

            migrationBuilder.CreateIndex(
                name: "IX_BenefitEnrolments_PlanID",
                table: "BenefitEnrolments",
                column: "PlanID");

            migrationBuilder.CreateIndex(
                name: "IX_BenefitEnrolments_WindowID",
                table: "BenefitEnrolments",
                column: "WindowID");

            migrationBuilder.CreateIndex(
                name: "IX_Dependents_EmployeeID",
                table: "Dependents",
                column: "EmployeeID");

            migrationBuilder.CreateIndex(
                name: "IX_EAPSessions_EmployeeID",
                table: "EAPSessions",
                column: "EmployeeID");

            migrationBuilder.CreateIndex(
                name: "IX_EAPSessions_ServiceID",
                table: "EAPSessions",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_FlexBenefitBuckets_PlanID",
                table: "FlexBenefitBuckets",
                column: "PlanID");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserID",
                table: "Notifications",
                column: "UserID");

            migrationBuilder.CreateIndex(
                name: "IX_RecognitionAwards_NominatorID",
                table: "RecognitionAwards",
                column: "NominatorID");

            migrationBuilder.CreateIndex(
                name: "IX_RecognitionAwards_RecipientID",
                table: "RecognitionAwards",
                column: "RecipientID");

            migrationBuilder.CreateIndex(
                name: "IX_RewardPoints_EmployeeID",
                table: "RewardPoints",
                column: "EmployeeID");

            migrationBuilder.CreateIndex(
                name: "IX_WellnessChallenges_ProgramID",
                table: "WellnessChallenges",
                column: "ProgramID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActivityLogs");

            migrationBuilder.DropTable(
                name: "AuditLogs");

            migrationBuilder.DropTable(
                name: "BenefitEnrolments");

            migrationBuilder.DropTable(
                name: "BenefitsReports");

            migrationBuilder.DropTable(
                name: "Dependents");

            migrationBuilder.DropTable(
                name: "EAPSessions");

            migrationBuilder.DropTable(
                name: "FlexBenefitBuckets");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "RecognitionAwards");

            migrationBuilder.DropTable(
                name: "RedemptionCatalogs");

            migrationBuilder.DropTable(
                name: "RewardPoints");

            migrationBuilder.DropTable(
                name: "WellnessChallenges");

            migrationBuilder.DropTable(
                name: "EnrolmentWindows");

            migrationBuilder.DropTable(
                name: "EAPServices");

            migrationBuilder.DropTable(
                name: "BenefitPlans");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "WellnessPrograms");
        }
    }
}
