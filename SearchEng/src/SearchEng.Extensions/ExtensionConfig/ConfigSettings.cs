using Microsoft.Framework.ConfigurationModel;
using Microsoft.Framework.Logging;
using System;
using System.Collections.Generic;
using System.Configuration;

using SearchEng.Extensions.Interfaces;
namespace SearchEng.Extensions.ExtensionConfig
{
    public class ConfigSettings
    {
        static IConfiguration Configuration;
        public static List<ExtensionElement> Extensions = new List<ExtensionElement>();
        public static LoggerElement Logger { get; set; }

        static ConfigSettings()
        {
            Configuration = new Microsoft.Framework.ConfigurationModel.Configuration().AddJsonFile("config.json");
            Logger = new LoggerElement(Configuration.GetSubKey("myconfig:providerSettings").GetSubKey("logger"));
            foreach (var module in Configuration.GetSubKey("myconfig:providerSettings").GetSubKeys("modules"))
            {
                var Ext = new ExtensionElement(module.Value);
                Extensions.Add(Ext);
            }
        }
    }

    //public class ConfigSettingsSection : ConfigurationSection
    //{
    //    public ConfigSettingsSection(IConfiguration config)
    //    {
    //        Logger = new LoggerElement(config.GetSubKey("logger"));
    //        var q = Logger.Config;
    //    }
    //    public LoggerElement Logger { get; set; }



    //    [ConfigurationProperty("modules", IsRequired = false)]
    //    public ProviderSettingsCollection Modules
    //    {
    //        get { return (ProviderSettingsCollection)base["modules"]; }
    //        set { base["modules"] = value; }
    //    }
    //}

    public class ElementBaseClass
    {
        public IConfiguration Config { get; set; }
        public ElementBaseClass(IConfiguration config)
        {
            Config = config;
            Type = config.Get("type");
            Name = config.Get("name");
        }
        public virtual string Get(string key)
        {
            return Config.Get(key);
        }
        public virtual void Set(string key, string value)
        {
            Config.Set(key, value);
        }

        public string Name { get; set; }
        public string Type { get; set; }
    }
    public class ElementBaseClass<T> : ElementBaseClass where T : class
    {
        public ElementBaseClass(IConfiguration config) : base(config)
        {

        }
        public T Getinstance()
        {
            var ty = System.Type.GetType(base.Type);
            if (ty != null)
            {
                return Activator.CreateInstance(ty) as T;
            }
            return null;
        }
    }


    public class LoggerElement : ElementBaseClass<ILogger>
    {
        public LoggerElement(IConfiguration config) : base(config)
        {
          
        }
        public string FileLocation
        {
            get { return base.Get("fileLocation"); }
            set { base.Set("fileLocation",value); }
        }
    }

    public class ExtensionElement : ElementBaseClass<IExtension>
    {
        public ExtensionElement(IConfiguration config) :base(config)
        {

        }
    }
}

