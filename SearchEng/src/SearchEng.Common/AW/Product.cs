using System;
using System.ComponentModel;
using System.Diagnostics;
using System.Collections.Generic;
using FluentValidation;
using SearchEng.Common.Interfaces;
using SearchEng.Common.Attributes;
using System.Linq.Expressions;
using System.Runtime.CompilerServices;

namespace SearchEng.Common.AW
{
    public partial class Product : IModifiedDate, INotifyPropertyChanged, IValidate
    {
        public Product()
        {
            CostHistories = new HashSet<ProductCostHistory>();
            ListPriceHistory = new HashSet<ProductListPriceHistory>();
        }

        Int32 _productID;
        public Int32 ProductID { get { return _productID; } set { _productID = value; } }

        private string _name;
        [Title]
        public string Name
        {
            get { return _name; }
            set
            {
                if (_name != value)
                {
                    _name = value;
                    this.OnPropertyChanged();
                }
            }
        }
        public String ProductNumber { get; set; }
        public Boolean MakeFlag { get; set; }
        public Boolean FinishedGoodsFlag { get; set; }
        public String Color { get; set; }
        public Int16 SafetyStockLevel { get; set; }
        public Int16 ReorderPoint { get; set; }
        public Decimal StandardCost { get; set; }
        public Decimal ListPrice { get; set; }
        public String Size { get; set; }
        public String SizeUnitMeasureCode { get; set; }
        public String WeightUnitMeasureCode { get; set; }
        public Decimal? Weight { get; set; }
        public Int32 DaysToManufacture { get; set; }
        public String ProductLine { get; set; }
        public String Class { get; set; }
        public String Style { get; set; }
        public Int32? ProductSubcategoryID { get; set; }
        public Int32? ProductModelID { get; set; }
        public DateTime SellStartDate { get; set; }
        public DateTime? SellEndDate { get; set; }
        public DateTime? DiscontinuedDate { get; set; }
        public System.Guid rowguid { get; set; }
        public DateTime ModifiedDate { get; set; }
        public virtual HashSet<ProductCostHistory> CostHistories { get; set; }
        public virtual HashSet<ProductListPriceHistory> ListPriceHistory { get; set; }
        public ProductSubcategory Subcategory { get; set; }

        public bool IsDirty { get; set; }

        public event PropertyChangedEventHandler PropertyChanged;

        void OnPropertyChanged<T>(Expression<Func<T>> propertyName)
        {
            var expression = (MemberExpression)propertyName.Body;
            string name = expression.Member.Name;
            OnPropertyChanged(name);
        }
        void OnPropertyChanged([CallerMemberName] string propertyName = "")
        {
            if (PropertyChanged != null)
            {
                PropertyChanged(this, new PropertyChangedEventArgs(propertyName));
            }
        }

        public IValidator GetValidator()
        {
            return new ProductValidator();
        }


        public bool IsValid()
        {
            var validate = GetValidator().Validate(this);
            return validate.IsValid;
        }

        public class ProductValidator : AbstractValidator<Product>
        {
            public ProductValidator()
            {
                RuleFor(obj => obj.StandardCost).GreaterThan(0);
                RuleFor(obj => obj.ListPrice).GreaterThan(0).When(obj => obj.FinishedGoodsFlag == true);
                RuleFor(obj => obj.Name).Length(6, 250);

            }
        }

    }


}
