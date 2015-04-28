using Microsoft.Framework.ConfigurationModel;
using System.Collections.Specialized;
using System.Threading;

using SearchEng.Extensions.Interfaces;
using SearchEng.Extensions.ExtensionConfig;

namespace SearchEng.Extensions
{
    public class AllowAllAnonymous : IExtension
    {
        public AllowAllAnonymous()
        {

        }

        public void Initialize(RepositoryExtensionFactory.ExtensionEvents events, IConfiguration config)
        {
            events.AddtoActionStarting(Validate);
        }

        private void Validate(RepositoryExtensionFactory.ModuleEventAgrs e)
        {
           
        }
    }


    public class AllowReadAnonymousAllowAuths : IExtension
    {
        public void Initialize(RepositoryExtensionFactory.ExtensionEvents events, IConfiguration config)
        {
            events.AddtoActionStarting(Validate);
        }

        private void Validate(RepositoryExtensionFactory.ModuleEventAgrs e)
        {
            if (e.Action == RepositoryExtensionFactory.ApiActionType.Get || e.Action == RepositoryExtensionFactory.ApiActionType.GetAll) return;
            //if (System.Web.HttpContext.Current.User.Identity.IsAuthenticated)
            //{
            //   return;
            //}
            if (Thread.CurrentPrincipal.Identity.IsAuthenticated)
            {
               return;
            }
            e.Cancel = true;

         // var username =  Thread.CurrentPrincipal.Identity.Name;
          //  var username = Thread.CurrentPrincipal.Identity.IsAuthenticated;
        }

    }

    public class ManagePermissionsfromRole
    {
        public void Initialize(RepositoryExtensionFactory.ExtensionEvents events, NameValueCollection config)
        {
            events.AddtoActionStarting(Validate);
        }

        private void Validate(RepositoryExtensionFactory.ModuleEventAgrs e)
        {
            
        }
    }
}