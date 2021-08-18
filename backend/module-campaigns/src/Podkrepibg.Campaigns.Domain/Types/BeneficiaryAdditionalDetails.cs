namespace Podkrepibg.Campaigns.Domain.Types
{
    public class BeneficiaryAdditionalDetails
    {
        public BeneficiaryAdditionalDetails(string website)
        {
            Website = website;
        }

        public BeneficiaryAdditionalDetails(string website, string otherLink)
            :this(website)
        {
            OtherLink = otherLink;
        }

        public string Website { get; }

        public string OtherLink { get; set; }
    }
}
