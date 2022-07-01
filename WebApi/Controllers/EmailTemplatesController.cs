using HtmlAgilityPack;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Flurl;
using Flurl.Http;
using System.Text.Json;
using HandlebarsDotNet;
using System.Runtime.Serialization;

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

        [HttpGet(Name = "ParseEmailTemplate")]
        public IEnumerable<EmailTemplate> ParseEmailTemplateAsync([FromQuery] Person person)
        {
            var json = _apiUrl.GetJsonAsync<Dictionary<string, EmailTemplate>>().Result;
            foreach (EmailTemplate item in json.Values)
            {
                string subject = item.Subject;
                string content = item.Content;
                var htmlDoc = new HtmlDocument();
                htmlDoc.LoadHtml(content);
                var codeNodes = htmlDoc.DocumentNode.SelectNodes("//code[@data-attribute]");
                if (codeNodes != null)
                {
                    foreach (var node in codeNodes)
                    {
                        string attrName = node.GetAttributeValue("data-attribute", "");
                        var newNode = htmlDoc.CreateTextNode("{{" + attrName + "}}");
                        node.ParentNode.ReplaceChild(newNode, node);
                    }                    
                }
                var template = Handlebars.Compile(htmlDoc.DocumentNode.OuterHtml);
                content = template(person);
                yield return new EmailTemplate
                {
                    Subject = subject,
                    Content = content
                };
            }
        }

    }

    [DataContract]
    public class Person
    {
        [DataMember(Name = "name")]
        public string Name { get; set; }

        [DataMember(Name = "email")]
        public string Email { get; set; }

        [DataMember(Name = "orders")]
        public IList<Order> Orders { get; set; }
    }

    [DataContract]
    public class Order
    {
        [DataMember(Name = "id")]
        public string Id { get; set; }

        [DataMember(Name = "date")]
        public DateTime CreateDate { get; set; }
    }

    public class EmailTemplate
    {
        public string Subject { get; set; }

        public string Content { get; set; }
    }

}
