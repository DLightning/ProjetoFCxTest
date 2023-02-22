using Microsoft.EntityFrameworkCore;
using WebAppTest.Models;

namespace WebAppTest.Data
{
    public class WebDbContext : DbContext
    {
        public WebDbContext(DbContextOptions options) : base(options) 
        {
        }

        public DbSet<User> Users { get; set; }
    }
}
