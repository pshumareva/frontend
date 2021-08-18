namespace Podkrepibg.Campaigns.Application.Beneficiaries.Commands.CreateBeneficiary
{
    using System;
    using FluentValidation;

    public class CreateBeneficiaryValidator : AbstractValidator<CreateBeneficiaryCommand>
    {
        public CreateBeneficiaryValidator()
        {
            RuleFor(b => b.Request.Name)
                .NotEmpty()
                .MaximumLength(100);

            RuleFor(b => b.Request.DateOfBirth)
                .NotEmpty()
                .When(b => b.Request.Type == DataContracts.Common.Nomenclatures.BeneficiaryType.Individual)
                .WithMessage("date of birth is required");

            RuleFor(b => b.Request.Type)
                .NotEmpty()
                .IsInEnum()
                .WithMessage("not a valid beneficiary type provided");

            RuleFor(b => b.Request.OrganizerId)
                .Must(id => Guid.TryParse(id, out var _))
                .WithMessage("not a valid guid provided");

            RuleFor(b => b.Request.CountryIsoCode)
                .NotEmpty()
                .IsInEnum()
                .WithMessage("not a valid countryIso2Code provided");

            RuleFor(b => b.Request.City)
                .NotEmpty()
                .IsInEnum()
                .WithMessage("not a valid city provided");

            RuleFor(b => b.Request.Address)
                .MaximumLength(200);

            RuleFor(b => b.Request.Email)
                .EmailAddress()
                .MaximumLength(100);

            RuleFor(b => b.Request.Phone)
                .MaximumLength(50);

            RuleFor(b => b.Request.Relationship)
                .NotEmpty()
                .IsInEnum()
                .WithMessage("not a valid relationship with beneficiary provided");

            RuleFor(b => b.Request.Website)
                .MaximumLength(500);

            RuleFor(b => b.Request.OtherLink)
                .MaximumLength(500);
        }
    }
}
