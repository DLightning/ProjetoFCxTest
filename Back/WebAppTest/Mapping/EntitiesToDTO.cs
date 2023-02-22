using AutoMapper;
using System.Runtime;
using WebAppTest.DTOs;
using WebAppTest.Models;

namespace WebAppTest.Mapping
{
    public class EntitiesToDTO : Profile
    {
        public EntitiesToDTO() {
            CreateMap<User, UserDTO>().ReverseMap();    
        }
    }
}
