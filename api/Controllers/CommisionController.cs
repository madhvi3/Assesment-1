using Microsoft.AspNetCore.Mvc;

namespace AvalphaTechnologies.CommissionCalculator.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommissionController : ControllerBase
    {
        public class CommissionRequest
        {
            public int LocalSalesCount { get; set; }
            public int ForeignSalesCount { get; set; }
            public decimal AverageSaleAmount { get; set; }
        }

        public class CommissionResponse
        {
            public decimal AvalphaLocalCommission { get; set; }
            public decimal AvalphaForeignCommission { get; set; }
            public decimal AvalphaTotalCommission { get; set; }
            public decimal CompetitorLocalCommission { get; set; }
            public decimal CompetitorForeignCommission { get; set; }
            public decimal CompetitorTotalCommission { get; set; }
        }

        [HttpPost]
        public IActionResult CalculateCommission([FromBody] CommissionRequest request)
        {
            // Input Validation
            if (request.LocalSalesCount < 0 || request.ForeignSalesCount < 0 || request.AverageSaleAmount < 0)
                return BadRequest("Input values must be zero or positive.");
            if (request.LocalSalesCount > 10000 || request.ForeignSalesCount > 10000 || request.AverageSaleAmount > 1000000)
                return BadRequest("Input values exceed reasonable upper bounds.");
            
            // Avalpha rules
            var avalphaLocal = 0.20m * request.LocalSalesCount * request.AverageSaleAmount;
            var avalphaForeign = 0.35m * request.ForeignSalesCount * request.AverageSaleAmount;
            var avalphaTotal = avalphaLocal + avalphaForeign;

            // Competitor rules
            var competitorLocal = 0.02m * request.LocalSalesCount * request.AverageSaleAmount;
            var competitorForeign = 0.0755m * request.ForeignSalesCount * request.AverageSaleAmount;
            var competitorTotal = competitorLocal + competitorForeign;

            var result = new CommissionResponse
            {
                AvalphaLocalCommission = avalphaLocal,
                AvalphaForeignCommission = avalphaForeign,
                AvalphaTotalCommission = avalphaTotal,
                CompetitorLocalCommission = competitorLocal,
                CompetitorForeignCommission = competitorForeign,
                CompetitorTotalCommission = competitorTotal
            };

            return Ok(result);
        }
    }
}
