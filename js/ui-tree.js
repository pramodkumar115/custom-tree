angular.module("custom-tree", [])
.directive("customTree", function($compile){
    
    function expandChildren(){
            console.log("liElement");
        }
    
    return {
        link: function(scope, element, attrs){
            if (attrs.data == undefined){
                element.html("The tree data is not defined. Please use an attribute data and assign the tree json");
            }
            else if(scope[attrs.data] == undefined ){
                element.html("The defined data variable " +attrs.data+ " does not exist");
            }
            else{
                var treeJson = scope[attrs.data];
                var options = scope[attrs.options];

                var baseURI = retrieveURL("ui-tree");
                var resURI = baseURI + "../res/";
                
                var treeMenu = getTreeMenu(treeJson, resURI, true);
                /*styleTreeMenu(treeMenu, options, true, resURI);*/
                element.append($compile(treeMenu)(scope));
            }
            
            
            function getTreeMenu(treeJson, resURI, isBaseElement){
                var expandAll = false, expandBaseElement = false;
                
                if(options != null){
                    if(options.expandAll != undefined){
                        expandAll = options.expandAll;
                    }
                    if(options.expandBaseElement){
                        expandBaseElement = options.expandBaseElement;
                    }
                }
                var ulElement = document.createElement("ul");
                var liBaseElement = document.createElement("li");
                var anchor = document.createElement("a");
                anchor.textContent = treeJson.text;
                liBaseElement.appendChild(anchor);
                /*anchor.style.float="right";
                anchor.style.display = 'inline-block';
                anchor.style.width="200px";*/
                if(options.listener != undefined){
                    anchor.setAttribute("ng-click", options.listener);
                }else{
                    anchor.setAttribute("ng-click", "handleTreeClick($event)");
                }

                ulElement.appendChild(liBaseElement);
                
                if(treeJson.children != undefined && treeJson.children.length > 0){
                    var expandableImgIcon = document.createElement("img");
                    expandableImgIcon.setAttribute("src", resURI+"./expand.png");
                    expandableImgIcon.className = "icon icon-expand";
                    expandableImgIcon.addEventListener('click',function(){
                        collapseList(this.parentElement);
                    }, false);
                    liBaseElement.insertBefore(expandableImgIcon, anchor);

                    var collapseImgIcon = document.createElement("img");
                    collapseImgIcon.setAttribute("src", resURI+"./collapsed.png");
                    collapseImgIcon.className = "icon icon-collapse";
                    collapseImgIcon.addEventListener('click',function(){
                        expandList(this.parentElement);
                    }, false);
                    /*liBaseElement.appendChild(collapseImgIcon);*/
                    liBaseElement.insertBefore(collapseImgIcon, anchor);

                    var folderIcon = document.createElement("img");
                    folderIcon.setAttribute("src", resURI+"./icon-close.png");
                    folderIcon.className = "icon icon-folder";
                    /!*liBaseElement.appendChild(folderIcon);*!/
                    liBaseElement.insertBefore(folderIcon, anchor);


                    for(var i in treeJson.children){
                        var child = treeJson.children[i];
                        var ulSubElement = getTreeMenu(child, resURI, false);
                        liBaseElement.appendChild(ulSubElement);
                    }
                    if(!expandAll){
                        collapseList(expandableImgIcon.parentElement);
                        if(expandBaseElement && isBaseElement){
                            expandList(collapseImgIcon.parentElement);
                        }
                    }else{
                        expandList(collapseImgIcon.parentElement);
                    }
                }else{
                    liBaseElement.style.paddingLeft = "20px";
                    liBaseElement.style.display = "block";
                    /*liBaseElement.style.left =  "-50px";*/

                    var folderIcon = document.createElement("img");
                    folderIcon.setAttribute("src", resURI+"./doc.png");
                    folderIcon.className = "icon icon-folder";
                    /*liBaseElement.appendChild(folderIcon);*/
                    folderIcon.style.paddingTop="2px";
                    liBaseElement.insertBefore(folderIcon, anchor);

                }

                anchor.addEventListener('dblclick', function(){
                    var collapseIconList = this.getElementsByClassName("icon-collapse");
                    if(collapseIconList != undefined && collapseIconList.length > 0){
                        var icon = collapseIconList[i];
                        if(icon.style.display == 'block'){
                            collapseList(this);
                        }else{
                            expandList(this);
                        }
                    }
                        
                })
                anchor.addEventListener('click',function(){
                    var me = this;
                    var liElements = document.getElementsByClassName('custom-tree-clicked');
                    if(liElements != undefined && liElements.length > 0){
                        for (i in liElements){
                            if(liElements[i].className != undefined && 
                               liElements[i].className.indexOf('custom-tree-clicked')!=-1){
                                liElements[i].className = liElements[i].className.replace('custom-tree-clicked','').trim();
                            }
                            
                        }
                    };
                    me.className = 'custom-tree-clicked';
                }, false);
                
                return ulElement;
            }
            
            function styleTreeMenu(treeMenu, options, isBaseElement, resURI){
                
                for(var i = 0; i< treeMenu.childElementCount; i++){
                    var child = treeMenu.children[i];
                    styleTreeMenu(child, options, false, resURI);
                    if(!isBaseElement){
                        
                    }
                }
            }
        }
    }
});
var retrieveURL = function(filename) {
    var scripts = document.getElementsByTagName('script');
    //console.log(new RegExp('(.*)'+filename+'\\.js$'));
    if (scripts && scripts.length > 0) {
        for (var i in scripts) {
            if (scripts[i].src && scripts[i].src.match(new RegExp(filename+'\\.js$'))) {
                return scripts[i].src.replace(new RegExp('(.*)'+filename+'\\.js$'), '$1');
            }
        }
    }
};

var expandList = function(parentLi){
    if(parentLi!=undefined && parentLi.children != undefined){
        for(var i = 0; i < parentLi.children.length; i++){
            var child = parentLi.children[i];
            if(child.className.indexOf("icon-expand") != -1){
                child.style.display = 'block';
            }
            if(child.className.indexOf("icon-collapse") != -1){
                child.style.display = 'none';
                //child.className = "icon icon-collapse-hidden";
            }
            else{
                child.style.display = 'block';
            }
        }
    }

}
var collapseList = function(parentLi){
    if(parentLi!=undefined && parentLi.children != undefined){
        for(var i = 0; i < parentLi.children.length; i++){
            var child = parentLi.children[i];
            if(child.className.indexOf("icon-expand") != -1){
                child.style.display = 'none';
            }
            if(child.className.indexOf("icon-collapse") != -1){
                child.style.display = 'block';
            }
            else{
                child.style.display = 'none';
            }
            if(child.className.indexOf("icon-folder") != -1){
                child.style.display = 'block';
            }
            if(child.tagName == "A"){
                child.style.display = 'block';
            }
        }
    }
}