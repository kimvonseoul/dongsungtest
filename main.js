var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title,list,body){
  return `<!doctype html>
   <html lang=ko utf-8>
    <head>
     <title>동성고등학교 - ${title}</title>
     <meta charset="utf-8"
    </head>
    <body>
     <h1><a href="/">동성고등학교</a></h1>
      ${list}
      <a href="/create">create</a>
     ${body}
    </body>
   </html>
   `;
}
function templateList(filelist){
  var list = '<ul>';
  var i = 0;
  while(i < filelist.length){
   list = list + `<li><a href ="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
   i = i + 1;
 }
 list = list+'</ul>';
 return list;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(err,filelist){
          var title = '동성고등학교(베타)';
          var discription = '테스트용 메인페이지';
          var list = templateList(filelist);
          var template = templateHTML(title,list,`<h2>${title}</h2>${discription}`);
          response.writeHead(200);
          response.end(template);
        })

      } else {
        fs.readdir('./data', function(err,filelist){
          fs.readFile(`data/${queryData.id}`, 'utf8', function(err, discription){
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(title,list,`<h2>${title}</h2>${discription}`);
            response.writeHead(200);
            response.end(template);
          });
         });
      }
    } else if(pathname === '/create'){
      fs.readdir('./data', function(err,filelist){
        var title = 'Web-Create';
        var list = templateList(filelist);
       var template = templateHTML(title,list,`
         <form action="http://localhost:80/process_create" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
           <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
           <input type="submit">
          </p>
         </form>
         `);
        response.writeHead(200);
        response.end(template);
      });
    }
     else {
      response.writeHead(404);
      response.end('Not found');
      }

});
var port = process.env.PORT || 3000; 
app.listen(port, function() { 
  console.log("Listening on " + port); 
});

