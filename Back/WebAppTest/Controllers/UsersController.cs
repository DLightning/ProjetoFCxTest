using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Extensions;
using System.IdentityModel.Tokens.Jwt;
using WebAppTest.Data;
using WebAppTest.DTOs;
using WebAppTest.Models;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System;

namespace WebAppTest.Controllers
{
    
    [Route("api/[controller]")]
    public class UsersController : Controller
    {
        private readonly WebDbContext _webDbContext;
        private readonly IMapper _mapper;

        public UsersController(WebDbContext webDbContext, IMapper mapper)
        {
            _webDbContext = webDbContext;
            _mapper = mapper;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody]User loginObj)
        {
            if (loginObj == null)
            {
                return BadRequest();
            }
            var user = await _webDbContext.Users.FirstOrDefaultAsync(x => x.Email == loginObj.Email && x.Password == loginObj.Password);
            var userDto = _mapper.Map<UserDTO>(user);
            

            if (user != null)
            {
                userDto.Token = CreateJwtToken(userDto);
                if (user.Status == EnumStatus.Active) { 
                    return Ok(new 
                    {
                        Token = userDto.Token,
                        Message = "Login Success" 
                    });
                }
                else
                {
                    return NotFound(new { Message = "User blocked or inactive!" });
                }
            }

            return NotFound(new 
            {   
                Message = "User Not Found!" 
            });

        }

        [HttpPut("reset")]
        public async Task<IActionResult> ResetPassword(string email, string password)
        {
            if(!UserEmail(email))
            {
                return BadRequest();
            }
            
            var user = await _webDbContext.Users.FirstOrDefaultAsync(x => x.Email == email);
            user.Password = password;
            _webDbContext.SaveChanges();

            return Ok(user);

        }

        //[Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllUser()
        {
            var users = await _webDbContext.Users.ToArrayAsync();

            var filteredUsers = users.Where(u => u.Status != EnumStatus.Inactive);

            if (filteredUsers == null || !filteredUsers.Any())
            {
                return NotFound();
            }

            return Ok(filteredUsers);
            //return Ok(users);
        }

        
        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody]UserDTO userRequest)
        {
            if(userRequest == null) { 
                return BadRequest(); 
            }
            if (UserNameExists(userRequest.Username))
            {
                return BadRequest("UserName already exist.");
            }
            if (UserEmail(userRequest.Email))
            {
                return BadRequest("Email and Cpf already exist.");
            }
            var user = _mapper.Map<User>(userRequest);

            user.Id = Guid.NewGuid();
            user.InclusionDate = DateTime.Now;
            user.AlterationDate = DateTime.Now;
            user.Status = EnumStatus.Active;

            await _webDbContext.Users.AddAsync(user);
            await _webDbContext.SaveChangesAsync();

            return Ok(user);
        }

        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateUser([FromRoute]Guid id,[FromBody]UserDTO userObj)
        {
            var user = await _webDbContext.Users.FindAsync(id);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            _mapper.Map(userObj, user);
            user.InclusionDate = _webDbContext.Entry(user).Property(x => x.InclusionDate).OriginalValue;
            user.AlterationDate = DateTime.Now;
            _webDbContext.Entry(user).State = EntityState.Modified;

            try
            {
                await _webDbContext.SaveChangesAsync();
                return Ok(userObj);
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
        }

        [HttpPut("delete{id}")]
        public async Task<IActionResult> DeleteUser([FromRoute] Guid id)
        {
            var user = await _webDbContext.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            user.Status = EnumStatus.Inactive;
            
            await _webDbContext.SaveChangesAsync();

            return Ok(user);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetUserById([FromRoute] Guid id)
        {
            var user = await _webDbContext.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPut("changeStatus{id}")]
        public async Task<IActionResult> changeStatus(Guid id, string status)
        {
            var user = await _webDbContext.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }
            var newStatusEnum = (EnumStatus)Enum.Parse(typeof(EnumStatus), status);
            user.Status = newStatusEnum;
            await _webDbContext.SaveChangesAsync();

            return Ok(user);
        }


        [HttpGet]
        [Route("username")]
        public async Task<IActionResult> GetUserByLogin(string username)
        {
            var users = await _webDbContext.Users.ToListAsync();

            var filteredUsers = users.Where(u => u.Username == username);

            if (filteredUsers == null || !filteredUsers.Any())
            {
                return NotFound();
            }

            return Ok(filteredUsers);
        }

        [HttpGet]
        [Route("status")]
        public async Task<IActionResult> GetUsersByStatus(string status)
        {
            var users = await _webDbContext.Users.ToListAsync();

            var filteredUsers = users.Where(u => u.Status.ToString() == status);

            if (filteredUsers == null || !filteredUsers.Any())
            {              
                return NotFound();
            }

            return Ok(filteredUsers);

        }

        [HttpGet]
        [Route("cpf")]
        public async Task<IActionResult> GetUsersByCpf(string cpf)
        {
            var users = await _webDbContext.Users.ToListAsync();

            var filteredUsers = users.Where(u => u.Cpf == cpf);

            if (filteredUsers == null || !filteredUsers.Any())
            {
                return NotFound();
            }

            return Ok(filteredUsers);

        }

        [HttpGet]
        [Route("inclusiondate-range")]
        public IActionResult GetUsersByInclusionDateRange(DateTime startDate, DateTime endDate)
        {
            List<User> result = new List<User>();

            var users = _webDbContext.Users.ToArray();

            foreach (User user in users)
            {
                if (user.InclusionDate >= startDate && user.InclusionDate <= endDate)
                {
                    if (user.Status != EnumStatus.Inactive)
                    {
                        result.Add(user);
                    }
                }
            }
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }


        [HttpGet]
        [Route("alterationdate-range")]
        public IActionResult GetUsersByAlterationDateRange(DateTime startDate, DateTime endDate)
        {
            List<User> result = new List<User>();

            var users = _webDbContext.Users.ToArray();

            foreach (User user in users)
            {
                if (user.AlterationDate >= startDate && user.AlterationDate <= endDate)
                {
                    if (user.Status != EnumStatus.Inactive)
                    {
                        result.Add(user);
                    }
                }
            }
            if (result == null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpGet("age-range")]
        public IActionResult GetUsersByAgeRange(int minAge, int maxAge)
        {
            List<User> result = new List<User>();

            var users = _webDbContext.Users
                .Where(u => u.BirthDate.Date != null)
                .AsEnumerable()
                .Where(u => CalculateAge(u.BirthDate.Date) >= minAge && CalculateAge(u.BirthDate.Date) < maxAge).ToList();

            foreach (var user in users) { 

                if (user.Status != EnumStatus.Inactive)
                {
                    result.Add(user);
                }
            }

            if (result == null || users.Count == 0) 
            { 
                return NotFound();
            }

            return Ok(result);
        }

        private int CalculateAge(DateTime dateOfBirth)
        {
            var today = DateTime.Today;
            var age = today.Year - dateOfBirth.Year;
            if (dateOfBirth > today.AddYears(-age)) age--;
            return age;
        }

        private bool UserExists(Guid id)
        {
            return _webDbContext.Users.Any(e => e.Id == id);
        }

        private bool UserEmail(string email)
        {
            return _webDbContext.Users.Any(e => e.Email == email);
        }
        private bool UserNameExists(string userName)
        {
            return _webDbContext.Users.Any(e => e.Username == userName);
        }

        private string CreateJwtToken(UserDTO user)
        {
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("veryverysecret.....");
            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Name, user.Name),
               
            });

            var credentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = credentials,
            };

            var token = jwtTokenHandler.CreateToken(tokenDescriptor);
            return jwtTokenHandler.WriteToken(token);
        }
    }
}
