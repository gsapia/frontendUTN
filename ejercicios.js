var array = [4,5,8,3];

function rotar(array){
for(let i =0; i<array.length ;i++){
    var x = array[i+1];
    array[i+1]= array[0]
    array[i] = x;
}
}

console.log(rotar())