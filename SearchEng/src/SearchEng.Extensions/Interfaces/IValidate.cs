using FluentValidation;
using FluentValidation.Attributes;
using FluentValidation.Results;
using SearchEng.Common.Interfaces;
using System;
using System.Collections.Generic;

namespace SearchEng.Extensions.Interfaces
{

    public class GenericValidationError  : IValidationError
    {
        public string ValidationError { get; set; }
        public string PropertyName { get; set; }
    }
    public class GenericValidationResult : IValidationResult
    {
        public IList<IValidationError> Errors { get; set; }
    
        public bool IsValid { get; set; }
     
    }

    public static class exensions {
        public static bool IsValid(this IValidate validate,object instance)
        {
            return validate.GetValidator().Validate(instance).IsValid;
        }

        public static IValidationResult ValidateModel(this IValidate validate, object model)
        {
            var validationResults = validate.GetValidator().Validate(model);
            IList<IValidationError> errors  = new List<IValidationError>();
        
            foreach (var error in validationResults.Errors)
            {
                errors.Add(new GenericValidationError { PropertyName=error.PropertyName, ValidationError = error.ErrorMessage });
            }
            return new GenericValidationResult { IsValid = validationResults.IsValid, Errors = errors };
        }

        //public static ValidationResult ValidateModel(object model)
        //{
        //    AttributedValidatorFactory validatorFactory = new AttributedValidatorFactory();
        //    var validator = validatorFactory.GetValidator(model.GetType());

        //    ValidationResult validationResults = validator.Validate(model);

        //    return validationResults;
        //}
    }
}