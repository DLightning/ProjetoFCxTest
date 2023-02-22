using WebAppTest.Enums;

namespace WebAppTest.Models
{
    public class User
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Username { get; set; }
        public string? Cpf { get; set; }
        public string? MotherName { get; set; }
        public string? PhoneNumber { get; set; }

        public DateTime BirthDate { get; set; }
        public DateTime InclusionDate { get; set; }
        public DateTime AlterationDate { get; set; }
        public EnumStatus Status { get; set; }






    }
}
