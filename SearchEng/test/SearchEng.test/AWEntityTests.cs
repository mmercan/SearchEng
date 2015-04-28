using System;
using Xunit;
using System.Linq;

namespace SearchEng.test
{
    public class AWEntityTests
    {

        [Fact]
        public void ConnectionCheck()
        {
          //  SearchEng.Data.AWEntities db = new Data.AWEntities();
          //  var isCreated = db.Database.EnsureCreated();
          //  Assert.True(isCreated);
        }

        public void ProductsExists()
        {
            SearchEng.Data.AWEntities db = new Data.AWEntities();
            var productcount = db.ProductSet.ToList().Count;
            Assert.NotSame(0, productcount);
        }


        public  void ProductSubCatExists()
        {
            SearchEng.Data.AWEntities db = new Data.AWEntities();

            var subcats = db.SubCategories.ToList();
            var subcat = db.ProductSet.FirstOrDefault(p=>p.ProductSubcategoryID!=null).Subcategory;
            
            Assert.NotNull(subcat);
        }

        public void PersonExits()
        {
            SearchEng.Data.AWEntities db = new Data.AWEntities();
            var personcount = db.PersonSet.ToList().Count;
            Assert.NotSame(0, personcount);
        }
    }
}