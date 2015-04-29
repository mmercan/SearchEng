using System;
using System.ComponentModel;

using SearchEng.Extensions.Interfaces;
using SearchEng.Common.Interfaces;

namespace SearchEng.Extensions.ExtensionConfig
{
    public class RepositoryExtensionFactory
    {
        public enum ApiActionType { GetAll,Get, Post, Put, Delete, SearchSuggestions, Search }
        static ExtensionEvents _Events = null;
        public static ExtensionEvents GetExtensions()
        {
            if (_Events == null)
            {
                var modulelements = ConfigSettings.Extensions;
                _Events = new ExtensionEvents();
                if (modulelements != null)
                {
                    foreach (ExtensionElement moduleElement in modulelements)
                    {
                        Type extensionType = Type.GetType(moduleElement.Type);
                        if (extensionType != null)
                        {
                            var module = Activator.CreateInstance(extensionType) as IExtension;
                            if (module != null) module.Initialize(_Events, moduleElement.Config);
                        }
                    }
                }
            }
            return _Events;
        }


        public static ModuleEventAgrs CallActionStarting(Object entity, ApiActionType action)
        {
            GetExtensions();
            var e = new ModuleEventAgrs(entity, action);
            if (_Events.EntityProcessing != null)
            {
                _Events.EntityProcessing(e);
                return e;
            }
            return e;
        }
        public static ModuleEventAgrs CallActionFinished(Object entity, ApiActionType action)
        {
            GetExtensions();
            var e = new ModuleEventAgrs(entity, action);
            if (_Events.EntityProcessed != null)
            {
                _Events.EntityProcessed(e);
                return e;
            }
            return e;
        }

        public static ModuleValidationEventAgrs CalltoValidate(Object entity, ApiActionType action)
        {
            GetExtensions();
            var e = new ModuleValidationEventAgrs(entity, action);
            if (_Events.ValidateEntity != null)
            {
                _Events.ValidateEntity(e);
                return e;
            }
            return e;
        }

        public delegate void ModuleDelegate<in T>(T e);

        public class ModuleEventAgrs : CancelEventArgs
        {
            public ModuleEventAgrs(Object entity, ApiActionType action)
            {
                Entity = entity;
                Action = action;
                MessageText = string.Empty;
            }
            public Object Entity { get;set; }
            public ApiActionType Action{get;set;}
            public string MessageText{get; set; }

        }
        public class ModuleValidationEventAgrs : CancelEventArgs
        {
            public ModuleValidationEventAgrs(Object entity,  ApiActionType action)
            {
                Entity = entity;
                Action = action;
                MessageText = string.Empty;
            }
            public Object Entity { get; set; }
            public ApiActionType Action { get; set; }
            public string MessageText { get; set; }
         
            public IValidationResult Result { get; set; }
        }

        public class ExtensionEvents
        {
            public ModuleDelegate<ModuleEventAgrs> SecurityProcessed { get; set; }

            public ModuleDelegate<ModuleValidationEventAgrs> ValidateEntity { get; set; }
            public ModuleDelegate<ModuleEventAgrs> EntityProcessed { get; set; }
            public ModuleDelegate<ModuleEventAgrs> EntityProcessing { get; set; }

            internal void AddtoActionStarting(Action<ModuleEventAgrs> method)
            {
                EntityProcessing += method.Invoke;
            }
            internal void AddtoActionStared(Action<ModuleEventAgrs> method)
            {
                EntityProcessed += method.Invoke;
            }

            internal void AddtoValidateEntity(Action<ModuleValidationEventAgrs> method)
            {
                ValidateEntity += method.Invoke;
            }
        }
    }
}