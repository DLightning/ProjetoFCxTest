using WebAppTest.Enums;

namespace WebAppTest.DTOs
{
    public class UserDTO
    {
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Username { get; set; }
        public string? Cpf { get; set; }
        public string? MotherName { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime BirthDate { get; set; }
        public EnumStatus Status { get; set; }
        public string? Token { get; set; }
    }
}
