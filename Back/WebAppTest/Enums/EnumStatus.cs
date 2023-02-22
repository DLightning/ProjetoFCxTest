using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace WebAppTest.Enums
{
    public enum EnumStatus
    {
        [Display(Name = "Bloqueado")]
        Blocked,
        [Display(Name = "Inativo")]
        [Description("Inativo")]
        Inactive,
        [Display(Name = "Ativo")]
        [Description("Ativo")]
        Active
    }
}
