using HtmlAgilityPack;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Flurl;
using Flurl.Http;
using System.Text.Json;

namespace WebApi.Controllers
{
    [Route("emailtemplates")]
    [ApiController]
    [EnableCors]
    public class EmailTemplatesController : ControllerBase
    {

        private static readonly string _apiUrl = "https://emailtemplate-efa56-default-rtdb.asia-southeast1.firebasedatabase.app/templates.json";

        [HttpPost(Name = "SaveEmailTemplate")]
        public async Task<bool> SaveEmailTemplateAsync(EmailTemplate template)
        {

            var htmlDoc = new HtmlDocument();
            htmlDoc.LoadHtml(template.Content);
            var header = htmlDoc.DocumentNode.SelectSingleNode("//header");
            header.Remove();
            var footer = htmlDoc.DocumentNode.SelectSingleNode("//footer");
            footer.Remove();

            string content = htmlDoc.DocumentNode.OuterHtml;
            template.Content = content;

            await _apiUrl.PostJsonAsync(template);

            return true;
        }

        //[HttpPost(Name = "ParseEmailTemplate")]
        //public async Task<EmailTemplate> ParseEmailTemplateAsync(string id)
        //{
        //    _apiUrl.GetJsonAsync<EmailTemplate>
        //}

    }

    public class EmailTemplate
    {
        public string Subject { get; set; }

        public string Content { get; set; }
    }

}
