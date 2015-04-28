using Microsoft.Framework.ConfigurationModel;

using SearchEng.Extensions.Interfaces;
using SearchEng.Extensions.ExtensionConfig;
namespace SearchEng.Extensions
{
    public class FillCommonFields : IExtension
    {
        public void Initialize(RepositoryExtensionFactory.ExtensionEvents events, IConfiguration config)
        {
            events.AddtoActionStared(Validate);
        }

        private void Validate(RepositoryExtensionFactory.ModuleEventAgrs e)
        {
            if (e.Action == RepositoryExtensionFactory.ApiActionType.Post ||
                e.Action == RepositoryExtensionFactory.ApiActionType.Put)
            {
                //if (e.Entity is Product)
                //{
                //    var pr = e.Entity as Product;
                //    pr.Unit = "5";
                //}
            }
        }
    }
}