using SearchEng.Common.Interfaces;
using System;

namespace SearchEng.Common.AW
{
    public class Person : IModifiedDate,Irowguid
    {
        public Int32 BusinessEntityID { get; set; }
        public String PersonType { get; set; }
        public Boolean NameStyle { get; set; }
        public String Title { get; set; }
        public String FirstName { get; set; }
        public String MiddleName { get; set; }
        public String LastName { get; set; }
        public String Suffix { get; set; }
        public System.Guid rowguid { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}