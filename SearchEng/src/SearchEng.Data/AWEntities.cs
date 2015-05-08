using Microsoft.Data.Entity;
using SearchEng.Common.AW;
using System;
using Microsoft.Data.Entity.Metadata;

namespace SearchEng.Data
{
    public class AWEntities : DbContext
    {
        public DbSet<Product> ProductSet { get; set; }
        public DbSet<Person> PersonSet { get; set; }

        public DbSet<ProductSubcategory> SubCategories { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //optionsBuilder.UseSqlServer("Data Source=(local);Initial Catalog=AdventureWorks2014;Integrated Security=True;Connect Timeout=15");

            optionsBuilder.UseSqlServer("Server=tcp:me1i2aveth.database.windows.net,1433;Database=AdventureWorks2012;User ID=mmercan@me1i2aveth;Password=Pa$$w0rd;Trusted_Connection=False;Encrypt=True;Connection Timeout=30;");
            base.OnConfiguring(optionsBuilder);
        }

     

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            

            modelBuilder.Entity<Product>((pr) =>
            {
                pr.ForSqlServer().Table(schemaName: "Production", tableName: "Product");
                pr.Key(p => p.ProductID);
                pr.Ignore(p => p.IsDirty);
                
               
               // pr.HasOne(p => p.Subcategory).WithMany(p => p.Products).ForeignKey(p => p.ProductSubcategoryID);
                pr.Reference(p => p.Subcategory).InverseCollection(p => p.Products).ForeignKey(p => p.ProductSubcategoryID);

                //pr.HasMany(p => p.CostHistories).WithOne(p => p.Product).ForeignKey(p => p.ProductID);
                pr.Collection(p => p.CostHistories).InverseReference(p => p.Product).ForeignKey(p => p.ProductID);

                //pr.HasMany(p => p.ListPriceHistory).WithOne(p => p.Product).ForeignKey(p => p.ProductID);
                pr.Collection(p => p.ListPriceHistory).InverseReference(p => p.Product).ForeignKey(p => p.ProductID);
            });

            modelBuilder.Entity<Person>((pr) =>
            {
                pr.ForSqlServer().Table(schemaName: "Person", tableName: "Person");
                pr.Key(p => p.BusinessEntityID);

            });

           


            modelBuilder.Entity<ProductSubcategory>((pr) =>
            {
                pr.ForSqlServer().Table(schemaName: "Production", tableName: "ProductSubcategory");
                pr.Ignore(p => p.IsDirty);
                pr.Key(p => p.ProductSubcategoryID);
            });
            base.OnModelCreating(modelBuilder);
        }
    }


}