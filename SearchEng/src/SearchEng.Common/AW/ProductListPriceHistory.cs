using SearchEng.Common.Interfaces;
using System;

namespace SearchEng.Common.AW
{
	public class ProductListPriceHistory : IModifiedDate
    {
		public Int32 ProductID { get; set; }
		public DateTime StartDate { get; set; }
		public DateTime? EndDate { get; set; }
		public Decimal ListPrice { get; set; }
		public DateTime ModifiedDate { get; set; }
        public virtual Product Product { get; set; }

    }
}
