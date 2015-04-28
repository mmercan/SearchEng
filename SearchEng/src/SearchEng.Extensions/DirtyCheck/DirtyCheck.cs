using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;

using SearchEng.Common.Interfaces;

namespace SearchEng.Extensions.DirtyCheck
{
    public static class ExtensionMethods
    {

        public static void OnPropertyChanged(this IDirtyCheck sender, PropertyChangedEventHandler handler, [CallerMemberName] string propertyName = "")
        {
            if (handler != null)
            {
                handler(sender, new PropertyChangedEventArgs(propertyName));
            }
            sender.IsDirty = true;
            //sender.OnDirty();
        }



        public static void WalkObjectGraph(this IDirtyCheck sender, Func<IDirtyCheck, bool> snippetForObject, Action<IList> snippetForCollection, params string[] exemptProperties)
        {
            var visited = new List<IDirtyCheck>();
            Action<IDirtyCheck> walk = null;
            walk = (o) =>
            {
                if (o != null && !visited.Contains(o))
                {
                    visited.Add(o);
                    bool exitWalk = snippetForObject.Invoke(o);
                    if (!exitWalk)
                    {
                        PropertyInfo[] properties = o.GetBrowsableProperties();
                        foreach (PropertyInfo property in properties)
                        {
                            if (!exemptProperties.Contains(property.Name))
                            {
                                if (property.PropertyType.IsSubclassOf(typeof(IDirtyCheck)))
                                {
                                    var obj = (IDirtyCheck)(property.GetValue(o, null));
                                    walk(obj);
                                }
                                else
                                {
                                    var coll = property.GetValue(o, null) as IList;
                                    if (coll != null)
                                    {
                                        snippetForCollection.Invoke(coll);
                                        foreach (object item in coll)
                                        {
                                            var check = item as IDirtyCheck;
                                            if (check != null) walk(check);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
            walk(sender);

        }




        public static List<IDirtyCheck> GetDirtyObjects(this IDirtyCheck sender)
        {
            string[] dontCheck = { "IsDirty" };
            var dirtyobjecs = new List<IDirtyCheck>();
            sender.WalkObjectGraph(o =>
            {
                if (o.IsDirty) dirtyobjecs.Add(o);
                return false;
            }, coll => { }, dontCheck);
            return dirtyobjecs;
        }

        public static void CleanAll(this IDirtyCheck sender)
        {
            sender.WalkObjectGraph(o => { if (o.IsDirty) o.IsDirty = false; return false; }, coll => { });
        }

        public static bool IsAnythingDirty(this IDirtyCheck sender)
        {
            bool isDirty = false;
            sender.WalkObjectGraph(o => { if (o.IsDirty) { isDirty = true; return true; } return false; }, coll => { });
            return isDirty;
        }

        public static PropertyInfo[] GetBrowsableProperties(this object sender)
        {
            PropertyInfo[] properties = sender.GetType().GetProperties();
            return properties;
        }
    }


    //public interface IValidator<T>
    //{
    //    IEnumerable<ValidationErrors> Validate(T item);
    //    ///<exception cref="ValidationException">Thrown when the item is not valid</exception>
    //    void Demand(T item);
    //}

    //public class ValidationErrors
    //{
    //}
}