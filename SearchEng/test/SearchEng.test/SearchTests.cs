using SearchEng.Search.Repository;
using System;
using Xunit;
using System.Linq;

namespace SearchEng.test
{
    public class SearchTests
    {
        [Fact]
        public void SearchExistItemGoodRead()
        {
            GoodReadSearchRepository repo = new GoodReadSearchRepository();
          var result =  repo.Results("lord of the ring");
            Assert.NotEmpty(result);
        }


        [Fact]
        public void SearchExistItemRotten()
        {

        }

        [Fact]
        public void SearchExistItemPerson()
        {
            PersonSearchRepository repo = new PersonSearchRepository(new SearchEng.Data.AWEntities());
            var results = repo.Results("Gail").ToList();
             var count = results.Count();

            Assert.NotSame(0, count);
        }

        [Fact]
        public void SearchExistItemProduct()
        {
            ProductSearchRepository repo = new ProductSearchRepository(new SearchEng.Data.AWEntities());
            var results = repo.Results("Helmet").ToList();
            var count = results.Count();
            Assert.NotSame(0, count);
        }

        [Fact]
        public void SearchNonExistItemGoodRead()
        {

        }

        [Fact]
        public void SearchNonExistItemRotten()
        {

        }
        [Fact]
        public void SearchNonExistItemPerson()
        {
            PersonSearchRepository repo = new PersonSearchRepository(new SearchEng.Data.AWEntities());
            var results = repo.Results("Murat").ToList();
            var count = results.Count();
           // Assert.Same(0, count);
        }
        [Fact]
        public void SearchNonExistItemProduct()
        {
            ProductSearchRepository repo = new ProductSearchRepository(new SearchEng.Data.AWEntities());
            var results = repo.Results("helmet").ToList();
            var count = results.Count();
            // Assert.Same(0, count);
        }

        [Fact]
        public void SearchWhiteSpaceGoodRead()
        {

        }
        [Fact]
        public void SearchWhiteSpaceRotten()
        {

        }
        [Fact]
        public void SearchWhiteSpacePerson()
        {
            PersonSearchRepository repo = new PersonSearchRepository(new SearchEng.Data.AWEntities());
            var results = repo.Results(" ").ToList();
            var count = results.Count();
            Assert.Equal(0, count);
        }
        [Fact]
        public void SearchWhiteSpaceProduct()
        {
            ProductSearchRepository repo = new ProductSearchRepository(new SearchEng.Data.AWEntities());
            var results = repo.Results(" ").ToList();
            var count = results.Count();
            Assert.Equal(0, count);
        }

    }
}