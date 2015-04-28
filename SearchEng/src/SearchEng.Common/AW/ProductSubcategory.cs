using SearchEng.Common.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace SearchEng.Common.AW
{
	/// <summary>
	/// Data annotations attributes for ProductSubcategory. 
	/// This class won't update by generator. Delete this file to get updated fields.
	/// </summary>
	public class ProductSubcategory :  IModifiedDate,Irowguid ,INotifyPropertyChanged
    {
        public ProductSubcategory()
        {
            Products = new HashSet<Product>();
        }
		public Int32 ProductSubcategoryID { get; set; }
		public Int32 ProductCategoryID { get; set; }
		public String Name { get; set; }
		public System.Guid rowguid { get; set; }
		public DateTime ModifiedDate { get; set; }

        public bool IsDirty { get; set; }
       
        public virtual HashSet<Product> Products { get; set; }

        public event PropertyChangedEventHandler PropertyChanged;
    }
}
