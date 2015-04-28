using Microsoft.Data.Entity;
using SearchEng.Common.AW;
using SearchEng.Search.RepositoryExtensions;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SearchEng.Search.Repository
{
    public class ProductSearchRepository : EFSearchRepository<Product>
    {
        public ProductSearchRepository(DbContext db) : base(db,
            (p, term) => p.Name.Contains(term) ,
            (p) => p.Name)
        {
        }

        public override IEnumerable<Product> Results(string term)
        {
            if (!string.IsNullOrWhiteSpace(term))
            {
                return _Dbset.Where(p => p.Name.Contains(term));
            }
          
            else return new List<Product>();
        }

    }
}