"use strict";
var promise = new Promise(function(resolve, reject) {
    setIMMe(resolve);
});

promise.then(function(value) {
  console.log("-----------------------");
  bufferwritetest();

  console.log("-----------------------");
  bufferreadtest();

  console.log("-----------------------");
  buffercopytest();

  console.log("-----------------------");
  bufferslicetest();

  console.log("-----------------------");
  bufferconcattest();

  console.log("-----------------------");
  streamread();

  console.log("-----------------------");
  streamwrite();
});

function setIMMe(resolve){
    /**
     * 先是两个nexttick执行，然后是两个setImmediate，最后是fs.stat
     */
    const fs=require("fs");
    fs.stat("nexttick.js",(err,stats)=>{
        if(stats){
            console.log("nexttick.js exists");
            resolve();
        }
    });

    setImmediate(()=>{
        console.log("Immediate Timer 1 executed");
    });

    setImmediate(()=>{
        console.log("Immediate Timer 2 executed");
    });

    process.nextTick(()=>{
        console.log("next tick 1 executed");
    });

    process.nextTick(()=>{
        console.log("next tick 2 executed");
    });
}

function bufferwritetest(){
    let buf256=new Buffer(256);
    buf256.fill(0);
    buf256.write("test text");
    console.log(buf256.toString());

    buf256.write("more text",9,9);
    console.log(buf256.toString());

    buf256[18]=43;
    console.log(buf256.toString());
}

function bufferreadtest(){
    let bufUtf8=new Buffer("some utf8 text \u00b6 \u30c6 \u20ac","utf8");
    console.log(bufUtf8.toString());
    console.log(bufUtf8.toString("utf8",5,9));

    let StringDecoder=require("string_decoder").StringDecoder;
    let decoder=new StringDecoder("utf8");
    console.log(decoder.write(bufUtf8));
    console.log(bufUtf8[18].toString(16));
    console.log(bufUtf8.readUInt32BE(18).toString(16));
    
}

function buffercopytest(){
    let alphabet=new Buffer("abcdefghijklmnopqrstuvwxyz");
    console.log(alphabet.toString());

    let blank=new Buffer(26);
    blank.fill();
    console.log("blank:"+blank.toString());
    alphabet.copy(blank);
    console.log("blank:"+blank.toString());

    let dashes=new Buffer(26);
    dashes.fill("-");
    console.log("dashes:"+dashes.toString());
    alphabet.copy(dashes,10,10,15);
    console.log("dashes:"+dashes.toString());

    let dots=new Buffer("-----------------");
    
    dots.fill(".");
    
    console.log("dots:"+dots.toString());
    for(let i=0;i<dots.length;i++){
        if(i%2){
            dots[i]=alphabet[i];
        }
    }
    console.log("dots:"+dots.toString());
}

function bufferslicetest(){
    let numbers=new Buffer("123456789");
    console.log(numbers.toString());

    let slice=numbers.slice(3,6);
    console.log(slice.toString());

    slice[0]="#".charCodeAt(0);
    slice[slice.length-1]="#".charCodeAt(0);
    console.log(slice.toString());
    console.log(numbers.toString());
}

function bufferconcattest(){
    let af=new Buffer("african swallow"),
        eu=new Buffer("european swallow"),
        question=new Buffer("air speed velocity of an ");
    console.log(Buffer.concat([question,af]).toString());
    console.log(Buffer.concat([question,eu]).toString());
}

function streamread(){
    let stream=require("stream"),
        util=require("util");
    util.inherits(Answers,stream.Readable);
    function Answers(opt){
        stream.Readable.call(this,opt);
        this.quotes=["yes","no","maybe"];
        this._index=0;
    }

    Answers.prototype._read=function(){
        if(this._index>this.quotes.length){
            this.push(null);
        }else{
            this.push(this.quotes[this._index]);
            this._index+=1;
        }
    };

    let r=new Answers();
    console.log("direct read:"+r.read().toString());
    r.on("data",(data)=>{
        console.log("callback read:"+data.toString());
    });
    r.on("end",(data)=>{
        console.log("no more answers");
    });
}

function streamwrite(){
    let stream=require("stream"),
        util=require("util");
    util.inherits(Writer,stream.Writable);
    function Writer(opt){
        stream.Writable.call(this,opt);
        this.data=new Array();
    }

    Writer.prototype._write=function(data,encoding,callback){
        this.data.push(data.toString("utf8"));
        console.log("adding:"+data);
        callback();
    }

    let w=new Writer();
    for(let i=1;i<=5;i++){
        w.write("item"+i,"utf8");
    }
    w.end("itemlast");
    console.log(w.data);
}

function streamduplex(){
    let stream=require("stream"),
        util=require("util");
    util.inherits(Duplexer,stream.Duplex);

    function Duplexer(opt){
        stream.Duplex.call(this,opt);
        this.data=[];
    }
    Duplexer.prototype._read=function readItem(size){
        let chunk=this.data.shift();
        if(chunk=="stop"){
            this.push(null);
        }else{
            if(chunk){
                this.push(chunk);
            }else{
                setTimeout(readItem.bind(this),500,size);
            }
        }
    };
    Duplexer.prototype._write=function(data,encoding,callback){
        this.data.push(data);
        callback();
    };
    let d=new Duplexer();
    d.on("data",(chunk)=>{
        console.log("read:",chunk.toString());
    });
    d.on("end",()=>{
        console.log("message complete");
    });
    d.write("i think ,");
    d.write("therefore ");
    d.write("i am.");
    d.write("rene descartes");
    d.write("stop");
}

function streamtransform(){
    let stream=require("stream"),
        util=require("util");
    util.inherits(JSONObjectStream,stream.Transform);
    
    function JSONObjectStream(opt){
        stream.Transform.call(this,opt);
    }
    JSONObjectStream.prototype._transform=function(data,encoding,callback){
        object=data?JSON.parse(data.toString()):"";
        this.emit("object",object);
        object.handled=true;
        this.push(JSON.stringify(object));
        callback();
    };
    JSONObjectStream.prototype._flush=function(cb){
        cb();
    };
    let tc=new JSONObjectStream();
    tc.on("object",(object)=>{
        console.log("name:",object.name);
        console.log("color:",object.color);
    });
    tc.on("data",(data)=>{
        console.log("data:",data.toString());
    });
    tc.write('{"name":"carolinus","color":"green"}');
    tc.write('{"name":"solarius","color":"blue"}');
    tc.write('{"name":"lo tae zhao","color":"gold"}');
    tc.write('{"name":"ommadon","color":"red"}');
}

function streampipe(){
    let stream=require("stream"),
        util=require("util");
    util.inherits(Reader,stream.Readable);
    util.inherits(Writer,stream.Readable);
    
    function Reader(opt){
        stream.Readable.call(this,opt);
        this._index=1;
    }
    Reader.prototype._read=function(size){
        let i=this._index++;
        if(i>10){
            this.push(null);
        }else{
            this.push("item "+i.toString());
        }
    };
    function Writer(opt){
        stream.Writable.call(this,opt);
        this._index=1;
    }
    Writer.prototype._write=function(data,encoding,callback){
        console.log(data.toString());
        callback();
    };
    let r=new Reader(),
        w=new Writer();
    r.pipe(w);
}

function streamzlib(){
    let zlib=require("zlib"),
        input=".......text........";
    zlib.deflate(input,(err,buffer)=>{
        if(!err){
            console.log("deflate:",buffer.length,buffer.toString("base64"));
            zlib.inflate(buffer,(err,buffer)=>{
                if(!err){
                    console.log("inflate ",buffer.length,buffer.toString());
                }
            });
            zlib.unzip(buffer,(err,buffer)=>{
                if(!err){
                    console.log("unzip:",buffer.length,buffer.toString());
                }
            });
        }
    });

    zlib.deflateRaw(input,(err,buffer)=>{
        if(!err){
            console.log("deflateRaw:",buffer.length,buffer.toString("base64"));
            zlib.inflateRaw(buffer,(err,buffer)=>{
                if(!err){
                    console.log("inflateRaw ",buffer.length,buffer.toString());
                }
            });
        }
    });

    zlib.gzip(input,(err,buffer)=>{
        if(!err){
            console.log("gzip:",buffer.length,buffer.toString("base64"));
            zlib.gunzip(buffer,(err,buffer)=>{
                if(!err){
                    console.log("gunzip ",buffer.length,buffer.toString());
                }
            });
            zlib.unzip(buffer,(err,buffer)=>{
                if(!err){
                    console.log("unzip gzip",buffer.length,buffer.toString());
                }
            })
        }
    });
}


function streamfile(){
    let zlib=require("zlib"),
        gzip=zlib.createGzip(),
        fs=require("fs"),
        inFile=fs.createReadStream("zlib_file.js"),
        outFile=fs.createWriteStream("zlib_file.gz");

    inFile.pipe(gzip).pipe(outFile);

    setTimeout(function(){
        let gunzip=zlib.createUnzip({flush:zlib.Z_FULL_FLUSH}),
            inFile=fs.createReadStream("zlib_file.gz"),
            outFile=fs.createWriteStream("zlib_file.unzipped");
            inFile.pipe(gunzip).pipe(outFile);
    },3000);
}

function fswritetest(){
    const fs=require("fs");
    let config={maxFiles:20,maxConnections:15,rootPath:"/webroot"},
        configTxt=JSON.stringify(config),
        options={encoding:"utf8",flag:"w"};
    fs.writeFile("config.txt",configTxt,options,(err)=>{
        if(err){
            console.log("config write failed");
        }else{
            console.log("config save");
        }
    });
}

function fswritesynctest(){
    const fs=require("fs");
    let fruitBowl=["apple","orange","bannan","grapes"];

    function writeFruit(fd){
        if(fruitBowl.length){
            let fruit=fruitBowl.pop()+" ";
            fs.write(fd,fruit,null,null,(err,bytes)=>{
                if(err){
                    console.log("file write failed");
                }else{
                    console.log("wrote ",fruit,bytes);
                    writeFruit(fd);
                }
            });
        }else{
            fs.close(fd);
        }
    }

    fs.open("fruit.txt","w",(err,fd)=>{
        writeFruit(fd);
    });
}

function fswritestreamtest(){
    let fs=require("fs"),
        grains=["wheat","rice","oats"],
        options={encoding:"utf8",flag:"w"},
        fileWriteStream=fs.createWriteStream("grains.txt",options);
        fileWriteStream.on("close",()=>{
            console.log("file close");
        });
        while(grains.length){
            let dta=grains.pop()+" ";
            fileWriteStream.write(data);
            console.log("wrote",data);
        }
        fileWriteStream.end();
}

function fsstatstest(){
    const fs=require("fs");
    fs.stat("file_stats.js",(err,stats)=>{
        if(!err){
            console.log("stats:"+JSON.stringify(stats,null," "));
            console.log(stats.isFile()?"is a file":"is not a file");
            console.log(stats.isDirectory()?"is a folder":"is not a folder");
            console.log(stats.isSocket()?"is a socket":"is not a socket");
            stats.isDirectory();
            stats.isBlockDevice();
            stats.isCharacterDevice();
            stats.isFIFO();
            stats.isSocket();
        }
    });
}

function fsdirtest(){
    const fs=require("fs"),
        path=require("path");
    
    function WalkDirs(dirpath){
        console.log(dirpath);
        fs.readdir(dirpath,(err,entries)=>{
            for(let idx in entries){
                let fullpath=path.join(dirpath,entries[idx]);
                ((fullpath)=>{
                    fs.stat(fullpath,(err,stats)=>{
                        if(stats&&stats.isFile()){
                            console.log(fullpath);
                        }else if(stats&&stats.isDirectory()){
                            WalkDirs(fullpath);
                        }
                    })
                })(fullpath);
            }
        })
    }

    WalkDirs("../ch06");
}

function fsdirremovetest(){
    //create
    fs.mkdir("./data",(err)=>{
        fs.mkdir("./data/folderA",(err)=>{
            fs.mkdir("./data/folderA/folderB",(err)=>{
                fs.mkdir("./data/folderA/folderB/folderD",(err)=>{
            
                });
            });
            fs.mkdir("./data/folderA/folderC",(err)=>{
                fs.mkdir("./data/folderA/folderC/folderE",(err)=>{
            
                });
            });
        });
    });

    //remove
    fs.rmdir("./data/folderA/folderB/folderC",(err)=>{
        fs.mkdir("./data/folderA/folderB",(err)=>{
            fs.mkdir("./data/folderD",(err)=>{
        
            });
        });
        fs.mkdir("./data/folderA/folderC",(err)=>{
            fs.mkdir("./data/folderE",(err)=>{
        
            });
        });
    });
}

function fsrenametest(){
    fs.rename("old.txt","new.txt",(err)=>{
        console.log(err?"rename failed":"file rename");
    });
    fs.rename("testDir","renameDir",(err)=>{
        console.log(err?"rename failed":"folder rename");
    });
}