//Global Variable Declaration
var colorFinalArr_E = [];
var pinSum = 0;


/** <<<<<<<< STARTS: encryptText method >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>**/

/** Encrypts @Input text using  @Input pinCode**/
function encryptText(text, pinCode) {

    colorFinalArr_E = [];
    pinSum = 0;
    railFencedstr_E = "";
    unicodeSubEStr_E = "";
    aes_E = "";

    //calculate pinSum
    for (var t = 0; t < pinCode.length; t++) {
        pinSum += parseInt(pinCode[t]);
    }

    /**--------- STARTS: Transposition Cypher using Rail Fence Technique ---------------------------**/
    var j = 0; var k = 1; var textIndex = 0;
    key = 3; cols = 7;
    totalRows = Math.ceil(((text.length * key) - (key - 1)) / cols);

    //creating cypher matrix
    var arr = Array(totalRows);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = Array(cols).fill('##');
    }

    //For Loop (Row j * Column k) fill matrix with input data
    for (j = 0; j < arr.length && textIndex < text.length; j++) {
        if (k > cols) {
            k = k - cols;
        }
        for (k; k <= cols && textIndex < text.length;) {
            arr[j][k - 1] = text[textIndex];
            textIndex += 1;
            k += key;
        }
    }

    //For Loop (Column  l * Row m) convert rail cypher matrix to string
    for (var l = 0; l < cols; l++) {
        for (var m = 0; m < arr.length; m++) {
            if (arr[m][l] !== '##') {
                railFencedstr_E = railFencedstr_E + arr[m][l];
            }
        }
    }
    /**--------- ENDS: Transposition Cypher using Rail Fence Technique -----------------------------**/




    /**--------- STARTS: Substitution Cypher using modified Caesar Cipher Technique ----------------**/
    //unicodes utf-8 32 to 126
    for (var p = 0; p < railFencedstr_E.length; p++) {
        unicodeSubEStr_E = unicodeSubEStr_E + String.fromCharCode((158 - railFencedstr_E.charCodeAt(p)));
    }
    /**--------- ENDS: Substitution Cypher using modified Caesar Cipher Technique ------------------**/




    /**--------- STARTS: Encryption using AES Symmetric key Technique ------------------------------**/
    var aes_E = CryptoJS.AES.encrypt(unicodeSubEStr_E, pinCode + pinSum).toString();
    /**--------- ENDS: Encryption using AES Symmetric key Technique --------------------------------**/




    /**--------- STARTS: utf-hex Color conversion  -------------------------------------------------**/
    colorRawArr_E = [];
    colorFinalArr_E = [];
    colorFinalStr_D = "";

    //unicodes utf-8 32 to 126
    for (var p = 0; p < aes_E.length; p++) {
        colorRawArr_E.push(aes_E.charCodeAt(p));
    }

    for (var d = 0; d < colorRawArr_E.length; d++) {
        if (d % 3 == 0) {
            colorFinalArr_E.push(fullColorHex(colorRawArr_E[d] * 2, colorRawArr_E[d] * 2, 0));
        } else if (d % 3 == 1) {
            colorFinalArr_E.push(fullColorHex(colorRawArr_E[d] * 2, 0, colorRawArr_E[d] * 2));
        } else if (d % 3 == 2) {
            colorFinalArr_E.push(fullColorHex(0, colorRawArr_E[d] * 2, colorRawArr_E[d] * 2));
        }
    }

    //remove previous element before inserting new one (Note: can be on first line of method)
    var parent = document.getElementById("output");
    var child = document.getElementById("colorCode");
    parent.removeChild(child);

    var para = document.createElement("div");
    para.setAttribute("id", "colorCode");
    document.getElementById("output").appendChild(para);

    for (var d = 0; d < colorFinalArr_E.length; d++) {
        var para = document.createElement("div");
        para.setAttribute("style", "background-color: " + colorFinalArr_E[d] + "; width:10Px; height:50px; float:left");
        document.getElementById("colorCode").appendChild(para);
    }

    /**--------- ENDS: utf-hex Color conversion  ---------------------------------------------------**/
}
/** <<<<<<<< ENDS: encryptText method >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>**/




/** <<<<<<<< STARTS: decryptCypher method >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>**/

/** Decrypts colorFinalArr_E using  @Input pinToDecrypt**/
function decryptCypher(pinToDecrypt) {

    railFencedstr_D = "";
    unicodeSubEStr_D = "";
    aes_D = "";

    /**--------- STARTS: utf-hex Color to string conversion  ---------------------------------------**/

    if (colorFinalArr_E.length <= 0) {
        alert("Text not yet encrypted! Please encrypt text before decrypting.");
        return;
    }

    for (var d = 0; d < colorFinalArr_E.length; d++) {
        if (d % 3 == 0) {
            colorFinalStr_D = colorFinalStr_D + String.fromCharCode(parseInt(colorFinalArr_E[d].slice(1, 3), 16) / 2);
        } else if (d % 3 == 1) {
            colorFinalStr_D = colorFinalStr_D + String.fromCharCode(parseInt(colorFinalArr_E[d].slice(1, 3), 16) / 2);
        } else if (d % 3 == 2) {
            colorFinalStr_D = colorFinalStr_D + String.fromCharCode(parseInt(colorFinalArr_E[d].slice(5, 7), 16) / 2);
        }
    }
    /**--------- ENDS: utf-hex Color to string conversion  -----------------------------------------**/




    /**--------- STARTS: Decryption using AES Symmetric key Technique ------------------------------**/
    var aes_D = (CryptoJS.AES.decrypt(colorFinalStr_D, pinToDecrypt + pinSum)).toString(CryptoJS.enc.Utf8);
    /**--------- ENDS: Decryption using AES Symmetric key Technique --------------------------------**/




    /**--------- STARTS: Decrypt Substitution Cypher using modified Caesar Cipher Technique --------**/
    //unicodes utf-8 32 to 126
    for (var p = 0; p < aes_D.length; p++) {
        unicodeSubEStr_D = unicodeSubEStr_D + String.fromCharCode((158 - aes_D.charCodeAt(p)));
    }
    /**--------- ENDS: Decrypt Substitution Cypher using modified Caesar Cipher Technique ----------**/




    /**--------- STARTS: Decrypt Transposition Cypher using Rail Fence Technique -------------------**/
    var j = 0; var k = 1; var textIndex = 0;
    key = 3;
    cols = 7;

    totalRows = Math.ceil(((unicodeSubEStr_D.length * key) - (key - 1)) / cols);

    //alert(totalRows);
    var arr = Array(totalRows);

    for (var i = 0; i < arr.length; i++) {
        arr[i] = Array(cols).fill('##');
    }

    //generate rail cypher matrix syntax
    for (j = 0; j < arr.length && textIndex < unicodeSubEStr_D.length; j++) {
        if (k > cols) {
            k = k - cols;
        }
        for (k; k <= cols && textIndex < unicodeSubEStr_D.length;) {
            arr[j][k - 1] = '**';
            textIndex += 1;
            k += key;
        }
    }

    textIndex = 0;
    //For Loop ( Column l * Row m) fill values
    for (var l = 0; l < cols && textIndex < unicodeSubEStr_D.length; l++) {
        for (var m = 0; m < arr.length && textIndex < unicodeSubEStr_D.length; m++) {
            if (arr[m][l] == '**') {
                arr[m][l] = unicodeSubEStr_D[textIndex];
                textIndex += 1;
            }
        }
    }

    textIndex = 0;
    //For Loop ( Column m * Row l) read string
    for (var m = 0; m < arr.length && textIndex < unicodeSubEStr_D.length; m++) {
        for (var l = 0; l < cols && textIndex < unicodeSubEStr_D.length; l++) {
            if (arr[m][l] !== '##') {
                railFencedstr_D = railFencedstr_D + arr[m][l];
                textIndex += 1;
            }
        }
    }

    document.getElementById("decryptedText").value = railFencedstr_D;

    if(railFencedstr_D===''){
        alert('Please enter correct pin code!!');
    }

    /**--------- ENDS: Decrypt Transposition Cypher using Rail Fence Technique ---------------------**/
}
/** <<<<<<<< ENDS: decryptCypher method >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>**/



/**--------- STARTS: color js RGB HEX ----------------------------------------------------------**/
var rgbToHex = function (rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
};

var fullColorHex = function (r, g, b) {
    var red = rgbToHex(r);
    var green = rgbToHex(g);
    var blue = rgbToHex(b);
    return '#' + red + green + blue;
};
/**--------- ENDS: color js RGB HEX ------------------------------------------------------------**/
