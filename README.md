# nun-v

*nun-v* is extension for [nun templating 
engine](http://github.com/akaspin/nun) for *static content versioning* 
inspired with [tornado static files and aggressive file 
caching](http://www.tornadoweb.org/documentation#static-files-and-aggressive-file-caching).

## How it works?

For example, you can add following settings in nginx.conf:

    location /static/ {
        root /var/www/static;
            if ($query_string) {
            expires max;
        }
    }

And if the link takes the following form:

    /static/image.jpg?v=hash
    
... browser will use a locally cached copy without ever checking for updates 
on the server.

## Usage

*nun-v* provides asynchronous *compile-phase filter* for rarely changing 
files.

Template:

    <h1>Static image</h1>
    <img src="{{~v}}title.jpg{{/v}}" />
    
Code:

    var nun = require('nun');
    var nunV = require('nun-v');
    
    var filters = {
        v: nunV.filter(__dirname + "/static", "/static"),
    };

    var origin = __dirname + "/template.html";
    
    nun.render(origin, {}, {filters:filters}, function(err, output){
        if (err) throw err;
        
        var buffer = '';
        output.addListener('data', function(data){ buffer += data; })
              .addListener('end', function(){ console.log(buffer) });
    });
    
Output:

    <h1>Static image</h1>
    <img src="/title.jpg?v=123456" />
    
... and 

>Since the `v` argument is based on the content of the file, if you 
update a file and restart your server, it will start sending a new `v` value, 
so the user's browser will automatically fetch the new file. If the file's 
contents don't change, the browser will continue to use a locally cached copy 
without ever checking for updates on the server, significantly improving 
rendering performance.