res={
    'data':[],
    'meta':[]
}

function getresponse(data,meta) {
    
    res.data=data;
    res.meta.push(meta);
    return res;
}
module.exports=getresponse;