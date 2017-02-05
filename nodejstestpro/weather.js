"use strict";
const http=require("http"),
      url=require("url"),
      qstring=require("querystring");

function sendResponse(weatherData,res){
    let page="<html><head><title>example</title></head><body><form method='post'>city:<input type='submit' value='get weather'></form>";
    console.log(weatherData);
    if(weatherData){
        page+="<h1>weather info</h1><p>"+weatherData+"</p>";
    }
    page+="</body></html>"
    res.end(page);
}

function parseWeather(weatherReasponse,res){
    let weatherData="";
    weatherReasponse.on("data",(chunk)=>{
        weatherData+=chunk;
    });
    weatherReasponse.on("end",()=>{
        sendResponse(weatherData,res);
    });
}

function getWeather(city,res){
    let options={
        host:"api.openweathermap.org",
        path:'/data/2.5/weather?q='+city
    };
    http.request(options,(weatherResponse)=>{
        parseWeather(weatherResponse,res);
    }).end();
}

http.createServer((req,res)=>{
    console.log(req.method);
    if(req.method=="POST"){
        let reqData="";
        req.on("data",(chunk)=>{
            reqData+=chunk;
        });
        req.on("end",()=>{
            let postParams=qstring.parse(reqData);
            console.log(reqData);
            getWeather(postParams.city,res);
        });
    }else{
        sendResponse(null,res);
    }
}).listen(8080);

/**
 * 201702hqf
 * huang0618
 * 2278587762@qq.com
 */