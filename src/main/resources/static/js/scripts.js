var obj;
var objetr;
var numberofcolumns = 128;
var numberoflines = 64;
var moused=0;
var mouseover=0;
var codearea;
var selectedarray;
selectedarray= 0;

function mousejs(el){
    document.getElementById('divki').onmousedown = function(){moused=1;};
    document.getElementById('divki').onmouseup = function(){moused=0;};
         
    if (moused==1){   
        el.style.backgroundColor = "#ffffff";
    }
}
function setSelected(el){
    el.style.backgroundColor = "#ffffff"; 
}
function removeelements(){
    var elem = document.getElementById("intro");
    elem.parentNode.removeChild(elem);
    return false;
}
function convertColor(color){  
    var rgbColors=new Object();

    ///////////////////////////////////
      // Handle rgb(redValue, greenValue, blueValue) format
      //////////////////////////////////
    if (color[0]=='r')
    {
        // Find the index of the redValue.  Using subscring function to 
        // get rid off "rgb(" and ")" part.  
        // The indexOf function returns the index of the "(" and ")" which we 
        // then use to get inner content.  
    color=color.substring(color.indexOf('(')+1, color.indexOf(')'));

        // Notice here that we don't know how many digits are in each value,
        // but we know that every value is separated by a comma.
        // So split the three values using comma as the separator.
        // The split function returns an object.
    rgbColors=color.split(',', 3);

        // Convert redValue to integer
    rgbColors[0]=parseInt(rgbColors[0]);
        // Convert greenValue to integer
    rgbColors[1]=parseInt(rgbColors[1]);
        // Convert blueValue to integer
    rgbColors[2]=parseInt(rgbColors[2]);		
    }

      ////////////////////////////////
      // Handle the #RRGGBB' format
      ////////////////////////////////
    else if (color.substring(0,1)=="#")
    {
        // This is simples because we know that every values is two 
        // hexadecimal digits.
    rgbColors[0]=color.substring(1, 3);  // redValue
    rgbColors[1]=color.substring(3, 5);  // greenValue
    rgbColors[2]=color.substring(5, 7);  // blueValue

        // We need to convert the value into integers, 
        //   but the value is in hex (base 16)!
            // Fortunately, the parseInt function takes a second parameter 
        // signifying the base we're converting from.  
    rgbColors[0]=parseInt(rgbColors[0], 16);
    rgbColors[1]=parseInt(rgbColors[1], 16);
    rgbColors[2]=parseInt(rgbColors[2], 16);
        }
    return rgbColors;
}
function blackorwhite(x,y){
    var pomoc=convertColor(document.getElementById("divki").rows[y].cells[x].style.backgroundColor);
    var average=0;
    for (var h=0;h<3;h++)
    {
        if (pomoc[h]==undefined) {pomoc[h]=0;}
        average=average+pomoc[h];
    }   
    average=average/3;                    
    average=Math.round(average);
    if (average<128) return 1; else return 0;
    
}
function convertcolorstocode(argument){
    var holderv = 0;
    var holderfortext="";
    var carray = document.getElementById("divki");
    argument.value = ""

    for (var i=0;i<numberoflines;i++){
        for (var j=0;j<numberofcolumns;j++){
            if (blackorwhite(j,i)==1){
                holderfortext+="0x00,";  
            }
            else{
                holderfortext+="0x01,";
            }
        }
        argument.value+=holderfortext;
        holderfortext="";
    }

}
function cleartable(){
    for (var i=0;i<numberoflines;i++){
        for (var j=0;j<numberofcolumns;j++){
            document.getElementById("divki").rows[i].cells[j].style.backgroundColor="blue";
            codearea.value="";
        }
    }        
}
function hideshow(){
    document.getElementById("mono1bit").style.display="none";
    document.getElementById("mono1bit").style.display="block";
}
function createtable(){	

    removeelements();

    refreshbutton = document.createElement("input");
    refreshbutton.className="btn";
    refreshbutton.type="button";
    refreshbutton.value="Clear all";
    refreshbutton.onclick=function(){cleartable();};
        
    colorstocodebutton = document.createElement("input");
    colorstocodebutton.className="btn";
    colorstocodebutton.type="button";
    colorstocodebutton.value="Convert to the array";
    
    previewbutton = document.createElement("input");
    previewbutton.className="btn";
    previewbutton.type="button";
    previewbutton.value="Preview the array";
    previewbutton.name = "upload";

    document.getElementById("tabelka").appendChild(refreshbutton);
    document.getElementById("tabelka").appendChild(colorstocodebutton);
    codearea = document.createElement("textarea");
    codearea.name = "area"
    codearea.className="textareacode";
    colorstocodebutton.onclick=function(){convertcolorstocode(codearea);};
    previewbutton.onclick=function(){previewdiv(1);};
    document.getElementById("tabelka").appendChild(colorstocodebutton);  
    document.getElementById("tabelka").appendChild(previewbutton);
    
    document.getElementById("tabelka").appendChild(document.createElement("br"));  
    document.getElementById("tabelka").appendChild(codearea);
    
    for (var j=0;j<numberoflines;j++){
        (function(objetr){
            objetr = document.createElement('tr');
            objetr.id="r"+j;
            document.getElementById('divki').appendChild(objetr);
            for (var i=0;i<numberofcolumns;i++){
                (function(obj){
                    obj = document.createElement('td');
                    obj.id="d"+i;
                    obj.style.backgroundColor="blue";                             
                    obj.onclick = function (){ return setSelected(obj);};
                    obj.onmouseover = function (){ return mousejs(obj);};                                
                    document.getElementById(objetr.id).appendChild(obj);
                }(i));
            }
        }(j));
    }
} 
function previewdiv(typeofarray){
    pop("allblac");
    var canvas = document.getElementById('can');
    var iksy=numberofcolumns;
    var igreki=numberoflines;
    var krok=700/(Math.max(iksy,igreki));

    if (canvas.getContext){
        var c = canvas.getContext('2d');
        for (var i=0;i<iksy;i++){
            for (var y=0;y<igreki;y++){
                if (blackorwhite(i,y)==1) c.fillStyle = "blue";
                else c.fillStyle = "white";              
                c.fillRect(krok*i,krok*y,krok,krok);            
            }
        }
    }
}
function pop(div){
    document.getElementById(div).style.display = 'block';
}
function hide(div){
    document.getElementById(div).style.display = 'none';
}