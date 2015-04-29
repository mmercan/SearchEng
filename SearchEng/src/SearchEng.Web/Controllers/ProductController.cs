using Microsoft.Data.Entity;
using SearchEng.Common.AW;
using SearchEng.Extensions.Repository;
using System;

namespace SearchEng.Web.Controllers
{
    public class ProductController : RepositoryWebApi<Product,int>
    {
        public ProductController(DbContext db) :base(db)
        {

        }
    }
}