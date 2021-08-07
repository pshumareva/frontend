namespace Podkrepibg.Campaigns.IntegrationTests.CampaignsServiceTests
{
    using System;
    using System.Threading.Tasks;
    using DataContracts.Campaign;
    using DataContracts.Common.Nomenclatures;
    using FluentAssertions;
    using Grpc.Core;
    using Moq;
    using NUnit.Framework;

    public class BeneficiaryTests : CampaignsServiceTestsBase
    {
        [Test]
        public async Task CreateBeneficiary_WithRandomValidRequest_ShouldPersistCorrectly()
        {
            // Arrange

            var createBeneficiaryRequest = new CreateBeneficiaryRequest
            {
                Name = _faker.Name.FirstName(),
                DateOfBirth = _faker.Date,
                Type = BeneficiaryType.Individual,
                OrganizerId = Guid.NewGuid().ToString(),
                CountryIsoCode = CountryCode.Bg,
                City = City.Varna,
                Address = $"{_faker.Address.BuildingNumber()} {_faker.Address.StreetAddress()}",
                Email = _faker.Internet.Email(),
                Phone = _faker.Phone.PhoneNumber(),
                Website = _faker.Internet.Url(),
                ConnectionWithBeneficiary = BeneficiaryConnection.Friend
            };

            // Act

            var createBeneficiaryResponse = await _campaignsService.CreateBeneficiary(
                createBeneficiaryRequest, Mock.Of<ServerCallContext>());

            // Assert

            createBeneficiaryResponse.Should().NotBeNull();

            var beneficiaryFromDb = await _appDbContext.Beneficiaries.FindAsync(Guid.Parse(createBeneficiaryResponse.Id));
            beneficiaryFromDb.Name.Should().Be(createBeneficiaryRequest.Name);
            beneficiaryFromDb.DateOfBirth.Should().Be(createBeneficiaryRequest.DateOfBirth);
            beneficiaryFromDb.Type.Should().Be(createBeneficiaryRequest.Type);
            beneficiaryFromDb.OrganizerId.ToString().Should().Be(createBeneficiaryRequest.OrganizerId);
            beneficiaryFromDb.ISO2CountryCode.Should().Be(createBeneficiaryRequest.CountryIsoCode);
            beneficiaryFromDb.City.Should().Be(createBeneficiaryRequest.City);
            beneficiaryFromDb.Address.Should().Be(createBeneficiaryRequest.Address);
            beneficiaryFromDb.ConnectionWithBeneficiary.Should().Be(createBeneficiaryRequest.ConnectionWithBeneficiary);
        }
    }
}
