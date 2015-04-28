using System;
using System.Reflection;
using System.Linq;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Linq.Expressions;
using System.Collections;

using System.Reflection.Emit;

using SearchEng.Common.Interfaces;

namespace SearchEng.Extensions
{
    public static class ExtensionMethods
    {
        public static void OnPropertyChanged<T>(this INotifyPropertyChanged cls, PropertyChangedEventHandler handler, Expression<Func<T>> propertyName)
        {
            var expression = (MemberExpression)propertyName.Body;
            string name = expression.Member.Name;
            OnPropertyChanged(cls, handler, true, name);
        }


        public static void OnPropertyChanged(this INotifyPropertyChanged cls, PropertyChangedEventHandler handler, [CallerMemberName] string propertyName = "")
        {
            OnPropertyChanged(cls, handler, true, propertyName);
        }

        public static void OnPropertyChanged(this INotifyPropertyChanged cls, PropertyChangedEventHandler handler, bool makeDirty, [CallerMemberName] string propertyName = "")
        {
            if (handler != null)
            {
                handler(cls, new PropertyChangedEventArgs(propertyName));
            }
            if (cls is IDirtyCheck && makeDirty)
            {
                (cls as IDirtyCheck).IsDirty = true;
            }
        }


        public static bool CheckDirty(this IDirtyCheck dirt)
        {
            bool isDirty = false;
            Walk<IDirtyCheck>(dirt,(d) => { if (d.IsDirty) { isDirty = true; return true; } else { return false; } }, null, null);

            return isDirty;
        }


        public static void ListAllDirtyObjects(this IDirtyCheck dirty)
        {
            List<IDirtyCheck> dirtyObjects = new List<IDirtyCheck>();
            Walk<IDirtyCheck>(dirty,(d) =>
            {
                if (d.IsDirty)
                {
                    dirtyObjects.Add(d);
                }
                return false;
            }, null, null);

        }

        public static void ResetAllDirtyObjects(this IDirtyCheck dirty)
        {
            List<IDirtyCheck> dirtyObjects = new List<IDirtyCheck>();
            Walk<IDirtyCheck>(dirty,(d) =>
            {
                if (d.IsDirty)
                {
                    d.IsDirty = false;
                }
                return false;
            }, null, null);

        }
  

        public static void dispose(this IDirtyCheck dirty)
        {
           // string s = "Hi";
          //  var w = s.GetType().IsPrimitive;

            List<object> objects = new List<object>();
            Walk<object>(dirty, (d) =>
            {
                objects.Add(d);
                return false;
            }, null, null);


        }

        //public static void Walk(this IDirtyChecker dirty,Func<IDirtyChecker,bool> ObjectCommand,Action<IEnumerable> ListCommand,params string[] examptProperties)
        //{
        //    List<string> exemptions = new List<string>();
        //    if (examptProperties != null) { exemptions = exemptions.ToList(); }
        //   // Type t = typeof(IDirtyChecker);

        //    List<IDirtyChecker> visited = new List<IDirtyChecker>();
        //    Action<IDirtyChecker> walk = null;
        //    walk = (o) =>
        //    {
        //        if (o != null && !visited.Contains(o))
        //        {
        //            visited.Add(o);
        //            bool exitwalk = false;
        //            if (ObjectCommand != null) { ObjectCommand.Invoke(o); }
        //            if (!exitwalk)
        //            {
        //                List<PropertyInfo> Properties = o.GetType().GetRuntimeProperties().ToList();
        //                foreach (PropertyInfo property in Properties)
        //                {
        //                    if (!exemptions.Contains(property.Name))
        //                    {
        //                        if (typeof(IDirtyChecker).IsAssignableFrom(property.PropertyType))
        //                        {
        //                            IDirtyChecker dt = property.GetValue(o, null) as IDirtyChecker;
        //                            walk(dt);
        //                        }
        //                        else
        //                        {
        //                            IEnumerable lst = property.GetValue(o, null) as IEnumerable;
        //                            //ICollection is common but not everythere HashSet<T> inherits from ICollection<T> but not ICollection, string has IEnumerable interface which is not one of our target collection type
        //                            if (lst != null && lst.GetType() != typeof(string))
        //                            {
        //                                if (ListCommand != null) { ListCommand.Invoke(lst); }
        //                                foreach (object item in lst)
        //                                {
        //                                    if (typeof(IDirtyChecker).IsAssignableFrom(item.GetType()))  walk(item as IDirtyChecker);
        //                                }
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //    };
        //    walk(dirty);
        //}

        public static void Walk<T>(T content, Func<T, bool> ObjectCommand, Action<IEnumerable> ListCommand, params string[] examptProperties) where T : class
        {
            HashSet<Type> myPrimetiveTypes = new HashSet<Type>();
            if (typeof(T) == typeof(object))
            {
               myPrimetiveTypes = new HashSet<Type>() { typeof(Boolean), typeof(Byte), typeof(SByte), typeof(Int16), typeof(UInt16), typeof(Int32), typeof(UInt32), typeof(Int64), typeof(UInt64), typeof(IntPtr), typeof(UIntPtr), typeof(Char), typeof(Double), typeof(Single), typeof(string) ,typeof(DateTime), typeof(DateTime?), typeof(decimal),typeof(int?)};
            }
            

            List<string> exemptions = new List<string>();
            if (examptProperties != null) { exemptions = exemptions.ToList(); }

            List<T> visited = new List<T>();
            Action<T> walk = null;
            walk = (o) =>
            {
                if (o != null && !visited.Contains(o))
                {
                    visited.Add(o);
                    bool exitwalk = false;
                    if (ObjectCommand != null) { exitwalk = ObjectCommand.Invoke(o); }
                    if (!exitwalk)
                    {
                        List<PropertyInfo> Properties = o.GetType().GetRuntimeProperties().ToList();
                        foreach (PropertyInfo property in Properties)
                        {
                            if (!exemptions.Contains(property.Name) && !myPrimetiveTypes.Contains(property.PropertyType))
                            {
                                if (typeof(T).IsAssignableFrom(property.PropertyType))
                                {
                                    T dt = property.GetValue(o, null) as T;
                                    walk(dt);
                                }
                                else
                                {
                                    IEnumerable lst = property.GetValue(o, null) as IEnumerable;
                                    //ICollection is common but not everythere HashSet<T> inherits from ICollection<T> but not ICollection, string has IEnumerable interface which is not one of our target collection type
                                    if (lst != null && lst.GetType() != typeof(string))
                                    {
                                        if (ListCommand != null) { ListCommand.Invoke(lst); }
                                        foreach (object item in lst)
                                        {
                                            if (typeof(T).IsAssignableFrom(item.GetType())) walk(item as T);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
            walk(content);
        }
    }
}