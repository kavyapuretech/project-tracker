function iframeclick(){
           document.getElementById("thisframe").contentWindow.document.body.onclck= function(){
                document.getElementById("thisframe").contentWindow.location.reload();
           }
       }