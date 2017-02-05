const http=require("http");
let options={
    hostname:"localhost",
    port:"8080"
};

function handleResponse(response){
    let serverData="";
    response.on("data",(chunk)=>{
        serverData+=chunk;
    });
    response.on("end",()=>{
        console.log("status"+response.statusCode);
        console.log("headers",response.headers);
        console.log(serverData);
    });
}

http.request(options,(response)=>{
    handleResponse(response);
}).end();

/**
 * 首先需要localhost 8080服务已经开启
 * 然后执行文件就能获取对应的status、headers等信息
 */