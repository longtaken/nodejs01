"use strict";
/*//GET
const http=require("http");
let messages=[
    "aaaaaa",
    "bbbbbb",
    "cccccc"
];
http.createServer((req,res)=>{
    res.setHeader("Content-Type","text/html");
    res.writeHead(200);
    res.write("<html><head><title>test http server</title></head>");
    res.write("<body>");
    for(let i=0,msth=messages.length;i<msth;i++){
        res.write("\n<h1>"+messages[i]+"</h1>");
    }
    res.end("\n</body></html>");
}).listen(8080);
*/

//POST
const http=require("http");
http.createServer((req,res)=>{
    let jsonData="";
    req.on("data",(chunk)=>{
        jsonData+=chunk;
    });
    req.on("end",()=>{
        let reqObj=JSON.parse(jsonData),
            resObj={
                message:"hello"+reqObj.name,
                question:"occupation--"+reqObj.occupation
            };
        res.writeHead(200);
        res.end(JSON.stringify(resObj));
    });
}).listen(8080);

let options={
    host:"127.0.0.1",
    path:"/",
    port:"8080",
    method:"POST"
};

function readJSONResponse(response){
    let responseData="";
    response.on("data",(chunk)=>{
        responseData+=chunk;
    });
    response.on("end",()=>{
        let dataObj=JSON.parse(responseData);
        console.log("raw--"+responseData);
        console.log("message--"+dataObj.message);
        console.log("question--"+dataObj.question);
    });
}

let req=http.request(options,readJSONResponse);
req.write('{"name":"bilbo","occupation":"burglar"}');
req.end();
/**
 * post直接在浏览器上会报错
 * 
 */