# nodejs
### events模块
* const events=require("events");new events.EventEmitter().emit("simpleEvent");

* 添加addListener(eventName,callback); on(eventName,callback); once(eventName,callback);<br>
  删除listeners(eventName); setMaxListeners(n); removeListener(eventName,callback)

### buffer
* 创建缓冲区<br>
    let buf256=new Buffer(256),new Buffer([0x6f,0x63,0x74,0x65]),new Buffer("some text \u00b6 \u30c6","utf8");
* 写入buffer对象的方法
创建之后不能扩展大小，但是可以把数据写到缓冲区中的任何位置。<br>
buffer.write(string,[offset],[length],[encoding]);使用encoding的编码从缓冲区内的offset（偏移量）索引开始，写入string中length数量的字节<br>
buffer[offset]=value;将索引offset处的数据替换为指定的value<br>
buffer.fill(value,[offset],[end]);将value写到缓冲区中从offset索引处开始，并在end索引处结束的每一个字节<br>
writeInt（8|16LE|16BE）  (value,offset,[noAssert]);buffer对象有一大批的方法来写入整数、无符号整数、双精度浮点数，浮点数等各种大小的数据，并采用大端或小端。value指定写入的值，offset指定要写的索引，而noassert指定是否要跳过value和offset的验证。noassert应保留默认的false，除非你绝对肯定value和offset的正确性<br>
* 读入buffer对象的方法
buffer.toString([encoding],[start],[end]);返回一个字符串，它包含了从缓冲区的start索引到end索引的字符，由encoding指定的编码解码。如果没有指定start或end，则toString使用缓冲区的开始或结束<br>
stringDecoder.write(buffer);返回缓冲区的解码字符串版本<br>
buffer[offset];返回缓冲区在指定的offset(偏移量)字节的八进制
readInt（8|16LE|16BE）(offset,[noAssert]);意思同理writeInt

* 复制缓冲区
copy(targetBuffer,[targetStart],[sourceStrat],[sourceIndex]);从一个缓冲区复制字符串数据到另一个缓冲区，需确保两个缓冲区使用相同编码<br>
sourceBuffer[index]=destinationBuffer[index];通过直接索引将一个缓冲区中的数据复制到另一个缓冲区<br>
* 对缓冲区切片
切片是对缓冲区的开始索引和结束索引之间的部分<br>
slice([start],[end]);
* 拼接缓冲区
可以把两个或多个buffer对象拼接在一起，形成一个新的缓冲区。<br>
concat(list,[totalLength]);方法接受buffer对象的数组作为第一个参数，并把定义缓冲区最大字节数的totalLength作为第二个参数。

### stream模块
* 数据流是可读、可写，或可读写的内存结构。流的目的是提供一种从一个地方向另一个地方传送数据的通用机制。流一般用于http数据和文件。
* readable流 旨在提供一种机制，方便读取从其他来源进入应用程序的数据。Readable流的一些常见实例：（客户端http响应、服务器http请求、fs读取流、zlib流、crypto流、TCP套接字、子进程的stdout和stderr、process.stdin）
* readable流提供read([size])方法来读取数据，其中size指定从流中读取的字节数。read()可以返回一个string对象、buffer对象或null。还包括这些事件（readable：在数据块可以从流中读取的时候发出。data：类似于readable，不同之处在于当数据处理程序被连接时，流被转变成流动的模式，并且数据处理程序被连续地调用，直到所有数据都被用尽。end：当数据将不再被提供时由流发出。close：当底层的资源，如文件关闭时发出。error：当在接受数据中出现错误发出）
* readable流对象页提供了一些函数
    * read([size]);从流中读取数据
    * setEncoding(encoding);设置从read()请求读取返回string时使用的编码
    * pause();暂停从该对象发出的data事件
    * resume();恢复从该对象发出的data事件
    * pipe(destination,[options]);把这个流的输出传输到一个由destination(目的地)指定的writable流对象。options是一个js对象。如{end:true}当readable结束时就结束writable目的地
    * unpipe([destination]);从writable目的地断开这一对象
* writable流 事件
    * -- write(chunk,[encoding],[callback]);将数据块写入流对象的数据位置。该数据可以是字符串或缓冲区。如果指定encoding，那么将其用于对字符串数据的编码。如果指定callback，那么它在数据已被刷新后被调用
    * -- end([chunk],[encoding],[callback]);与write()相同，除了它把writable对象置于不再接受数据的状态，并发送finish事件外
    * drain:在write()调用返回false后，当准备好开始写更多的数据时，发出此事件通知监听器
    * finish:当end()调用writable对象上被调用，所有数据都被刷新，并且不会有更多的数据将接受时发出此事件
    * pipe:当pipe()方法在readable流上被调用，以添加此writable为目的地，发出此事件
    * unpipe:当unpipe()方法在readable流上被调用，以删除此writable为目的地，发出此事件
* duplex 流
    * duplex(双向)流是结合可读写功能的流。duplex流一个很好例子tcp套接字连接。你可在创建套接字后读取和写入它。
    * 为了实现自己的自定义duplex流对象，你需要先继承duplex流的功能。
* transform 流
    * transform(变换)流扩展了duplex流，但它修改writable流和readable流之间的数据。当你需要修改从一个系统到另一个系统的数据时，此流类型会非常有用
    * transform流实例  zlib流  crypto流  
* readable流用管道输送到writable流
    * 通过pipe(writableStream,[options])函数把readable流链接到writable流。
* 用zlib压缩与解压缩数据
    * gzip/gunzip 标准gzip压缩
    * deflate/inflate 基于huffman编码deflate压缩算法
    * deflateRaw/inflateRaw 针对原始缓冲区的deflate压缩算法
* 压缩/解压缩流
    * 用zlib压缩/解压缩数据流与压缩/解压缩缓冲区略有不同。可以使用pipe()函数，通过压缩/解压缩对象来把数据从一个流输送到另一个流。可适用于把任何readable数据流压缩成writable流

### 文件系统fs模块
* 打开和关闭文件
    * fs.open(path,flags,[mode],callback);  fs.openSync(path,flags,[mode]); flags指定打开文件的模式。mode是可选参数，设置文件访问模式，模式0666，表示可读可写。
        * r 打开文件用于读取；<br>r+打开文件用于读写。
        * rs 在同步模式下用于读取。与强制使用fs.openSync是不同的。操作系统将绕过本地文件系统缓存。因为它可以让你跳过可能失效的本地缓存，所以对NFS挂载是有用的。可能对性能有影响<br>
        rs+ 同rs，除了打开文件用于读取和写入外
        * w 打开文件用于写操作。如果它不存在就创建文件。存在则截断。<br>wx 同w，如果路径存在则打开失败
        * w+ 打开文件用于读写。不存在创建存在截断。<br> wx+ 同w+路径存在则打开失败
        * a 打开文件用于追加。不存在则创建。<br>ax 同a。不存在则创建该文件
        * a+ 打开文件进行读取和追加。不存在则创建。<br>ax+ 同a+，路径存在则打开失败。
    * fs.close(fs,callback);    fs.closeSync(fs);文件被打开，需要关闭它以迫使操作系统把更改刷新到磁盘并释放操作系统锁。
* 写入文件
    * fs.writeFile(path,data,[options],callback);   fs.writeFileSync(path,data,[options]); path参数指定文件路径，可以是相对或绝对路径。data参数指定江北写入到文件中的string或buffer对象。可选的options参数是一个对象，它可以包含定义字符串编码以及打开文件时使用的模式和标志的encoding、mode和flag属性。异步方法需要callback参数，写入文件完成是被调用。
* 同步文件写入
    * fs.writeSync(fd,data,offset,length,position); fd参数是openSync返回的文件描述符。data参数指定将被写入文件中的string或buffer对象。offset参数指定要开始读取数据的输入数据中的索引；如果你想从字符串或缓冲区的当前索引开始，此值为null。length参数指定写入的字节数；指定为null则为从缓冲区末尾写入。position参数指定在文件中开始写入的位置；使用文件当前位置则设置为null。
* 流文件写入
    * fs.createWriteStream(path,[options]); path指定文件路径，可以是相对或绝对路径。可选的options是一个对象，它可以包含定义字符串编码以及打开文件时使用的模式和标志的encoding、mode和flag属性

* 读取文件
    * 类似写入api
    * 简单文件读取fs.readFile(path,[options],callback); fs.readFileSync(path,[options]);
    * 同步文件读取fs.readSync(fd,buffer,offset,length,position);
    * 异步文件读取fs.read(fd,buffer,offset,length,position,callback);
    * 流文件读取fs.createReadStream(path,[options]);
* 验证路径的存在性
    * fs.exists(path,callback); fs.existsSync(path);  例子：fs.exists("xx.js",(exists)=>console.log(exists?"path exists":"path does not exist"));
* 获取文件信息
    * fs.stats(path,callback);  fs.statsSync(path);   例子：nexttick.js fsstatstest fn
* 列出文件
    * fs.readdir(path,callback);    fs.readdirSync(path);
* 删除文件
    * fs.unlink(path,callback);     fs.unlinkSync(path);  例子：fs.unlink("new.txt",(err)=>{console.log(err?"file delete failed":"file deleted")});
* 截断文件
    * 截断文件是指通过把文件结束处设置为比当前值小的值来减小文件的大小。fs.truncate(path,len,callback); fs.truncateSync(path,len);
    * truncateSync函数返回true或false，具体取决于文件是否被成功截断。如果文件截断遇到错误，则异步truncate()调用传递一个错误值给回调函数。fs.truncate("new.txt",(err)=>{console.log(err?"file truncate failed":"file truncated")});
* 建立和删除目录
    * 从nodejs添加目录，fs.mkdir(path,[mode],callback); fs.mkdirSync(path,[mode]); path可以是绝对或相对路径，可选的mode允许你指定新目录的访问模式。mkdirSync(path)函数返回true或false，取决于目录是否成功创建。另一方面，如果创建目录时遇到错误，异步的mkdir()调用传递一个error给回调函数。
    * 从nodejs删除目录，fs.rmdir(path,callback); fs.rmdirSync(path);
* 重命名文件和目录
    * fs.rename(oldpath,newpath,callback);  fs.renameSync(oldpath,newpath);
* 监视文件更改入
    * fs.watchFile(path,[options],callback);  例子：fs.watchFile("log.txt",{persistent:true,interval:5000},(curr,prev)=>{console.log(curr.mtime,prev.mtime);});

* 了解url对象
    