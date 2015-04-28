using Microsoft.Data.Entity;
using SearchEng.Common.AW;
using SearchEng.Search.RepositoryExtensions;
using System;
using System.Linq;
using System.Collections.Generic;

namespace SearchEng.Search.Repository
{

  
    public class PersonSearchRepository : EFSearchRepository<Person>
    {
        public  PersonSearchRepository(DbContext db) :base(db, 
            (p, term) => {return String.Concat(p.FirstName.ToLower(), " ", p.LastName.ToLower()).Contains(term.ToLower());},
            (p)=> { return p.FirstName + " " + p.LastName; })
        {

        
        }

        public override IEnumerable<Person> Results(string term)
        {
            //Stored Procedure or Functions still not supported by EF7 
            //SQLCommand will be ideal if speed is a problem
            

            return base.Results(term);
        }

    }
}