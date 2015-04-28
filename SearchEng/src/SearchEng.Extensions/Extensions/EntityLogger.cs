using System;
using Microsoft.Framework.ConfigurationModel;
using System.Diagnostics;

using SearchEng.Extensions.Interfaces;
using SearchEng.Extensions.ExtensionConfig;

namespace SearchEng.Extensions
{
    public class EntityLogger : IExtension
    {
        public void Initialize(RepositoryExtensionFactory.ExtensionEvents events, IConfiguration config)
        {
            events.AddtoActionStarting((e) => {
                Debug.WriteLine("[Action Starting] [LOGGED] "+e.Entity.ToString() + " " + e.Action.ToString());
               
            });

            events.AddtoActionStared((e) => {
                Debug.WriteLine("[Action Completing] [LOGGED] " + e.Entity.ToString() + " " + e.Action.ToString());

            });


            //  events.CallEntityProcessed
        }
    }
}