using SearchEng.Common.Interfaces;
using System;

namespace SearchEng.Common.AW
{
    /// <summary>
    /// Data annotations attributes for ProductCostHistory. 
    /// This class won't update by generator. Delete this file to get updated fields.
    /// </summary>
    public class ProductCostHistory : IModifiedDate
    {
        public Int32 ProductID { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public Decimal StandardCost { get; set; }
        public DateTime ModifiedDate { get; set; }

        public virtual Product Product { get;set;}
	}
}
