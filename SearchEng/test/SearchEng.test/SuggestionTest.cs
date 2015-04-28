using SearchEng.Search.Repository;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SearchEng.test
{
    public class SuggestionTest
    {
        public IEnumerable<string> SuggestExistItemProduct(string term)
        {
            ProductSearchRepository repo = new ProductSearchRepository(new SearchEng.Data.AWEntities());
            var results = repo.Suggestions(term).ToList();

            var count = results.Count();
            // Assert.NotSame(0, count);

            return results;
        }


        public void SuggestExistItemProduct()
        {
           var r0= SuggestExistItemProduct("h");

            var r1 = SuggestExistItemProduct("he");

            var r2 = SuggestExistItemProduct("hel");

            var r3 = SuggestExistItemProduct("helm");

            var r4 = SuggestExistItemProduct("helme");

            var r5 = SuggestExistItemProduct("helmet");
        }
    }
}