let censoredWords=["sad","bad","mad"],
    customCensoredWords=[];

function censor(inStr){
    for(let i=0;i<censoredWords.length;i++){
        inStr=inStr.replace(censoredWords[i],"****");
    }
    for(let i=0;i<customCensoredWords.length;i++){
        inStr=inStr.replace(customCensoredWords[i],"****");
    }
    return inStr;
}

function addCensoreWord(word){
    customCensoredWords.push(word);
}

function getCensoreWords(){
    return censoredWords.concat(customCensoredWords);
}

exports.censor=censor;
exports.addCensoreWord=addCensoreWord;
exports.getCensoreWords=getCensoreWords;
