document.addEventListener("DOMContentLoaded",function(event){

    var SearchEngine = 'https://www.google.com/search?q=';

    var DontShowAnyCountries = ['Sweden','Switzerland','USA','Ukraine','Belarus','Spain','Brazil','Denmark','Japan','Austria','France','Philippines','UK','Poland','Poland','Germany','Canada','Netherlands','Italy','Israel','Taiwan','Belgium','Russia','Australia','Czech Republic','Bulgaria','China'];

    var outputdata = '';
    var tags = {};
    var countstyles = 0;
    
    var pages = document.querySelectorAll('section');
    var menulinks = document.querySelectorAll('.mbut');
    var searchdiv = document.getElementById('suche');
    
    function hidepages(){
        if(pages){
            for(var i = 0; i < pages.length; i++){ pages[i].classList.add('is-hidden'); }
            for(var i = 0; i < menulinks.length; i++){ menulinks[i].classList.remove('active'); }
            searchdiv.classList.add('is-hidden');
        }
    };
    hidepages();
    if(pages){ pages[0].classList.remove('is-hidden'); menulinks[0].classList.add('active'); searchdiv.classList.remove('is-hidden'); };
    
    if(menulinks){
        for(var i = 0; i < menulinks.length; i++){
            currentml = menulinks[i];
            currentml.addEventListener('click',function(e){
                e.preventDefault();
                var mldata = this.dataset.page;
                hidepages();
                window.scroll(0, 100);
                document.getElementById(mldata).classList.remove('is-hidden');
                this.classList.add('active');
                if(mldata=='styles'){ searchdiv.classList.remove('is-hidden'); };
            });
        };
    };
    
    
    //Put JSON in DOM
    for(var i=0; i<data.length; i++){

        if(data[i].Type==1){
            
            let CurrentArtistName = data[i].Name;
            let currentAnchor = CurrentArtistName.replace(/[^a-zA-Z]+/g,'');
            let catlist = data[i].Category.replace(/\\/g,''); //remove backslash
            let deathdate = ''; let dagger = ''; deathdate = data[i].Death;
            if(deathdate!=false){ dagger = '<sup> &dagger;</sup>'; }

            const lookupArray = CurrentArtistName.replace(/ *\([^)]*\) */g, "").split(',').map(function(item){ return item.trim(); }); //remove braces, split at comma, trim spaces
            let LUPart1 = lookupArray[0];
            let LUPart2 = lookupArray[1];
            if(LUPart2){
                var LUArtist = SearchEngine + LUPart2 + '%20' + LUPart1;
            } else { //if no comma in name
                var LUArtist = SearchEngine + LUPart1;
            }
            
            outputdata = outputdata + '<div id="' + currentAnchor + '" class="stylepod lazy" data-bg="./img/' + data[i].Image + '">';
            outputdata = outputdata + '<div class="styleinfo">';
            outputdata = outputdata + '<h3>' + data[i].Name + dagger + '</h3>';
            outputdata = outputdata + '<div class="more">';
            outputdata = outputdata + '<p class="category" title="' + catlist + '">' + catlist + '</p>';
            outputdata = outputdata + '<p class="checkpoint"><span>' + data[i].Checkpoint + '</span></p>';
            outputdata = outputdata + '<fieldset><legend>Copy Prompt</legend><span class="copyme">' + data[i].Prompt + '</span></fieldset>';
            outputdata = outputdata + '<p class="extralinks"><a class="zoomimg" title="Big Image" href="./img/' + data[i].Image + '" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" class="zoomimgsvg" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="square" stroke-miterlimit="10" stroke-width="32" d="M432 320v112H320M421.8 421.77L304 304M80 192V80h112M90.2 90.23L208 208M320 80h112v112M421.77 90.2L304 208M192 432H80V320M90.23 421.8L208 304"/></svg></a><a href="' + LUArtist + '" title="Look Up Artist" target="_blank" class="lookupartist"><svg xmlns="http://www.w3.org/2000/svg" class="lookupartistsvg" viewBox="0 0 512 512"><path d="M464 428L339.92 303.9a160.48 160.48 0 0030.72-94.58C370.64 120.37 298.27 48 209.32 48S48 120.37 48 209.32s72.37 161.32 161.32 161.32a160.48 160.48 0 0094.58-30.72L428 464zM209.32 319.69a110.38 110.38 0 11110.37-110.37 110.5 110.5 0 01-110.37 110.37z"/></svg></a></p>';
            outputdata = outputdata + '</div>';
            outputdata = outputdata + '</div>';
            outputdata = outputdata + '<div class="gallery">';
            outputdata = outputdata + '<figure><figcaption></figcaption></figure>';
            outputdata = outputdata + '<figure></figure>';
            outputdata = outputdata + '<figure></figure>';
            outputdata = outputdata + '<figure></figure>';
            outputdata = outputdata + '</div>';
            outputdata = outputdata + '</div>';
            
            countstyles++;
            
            //fill tags list for filter
            let arrrrr = data[i].Category.split(', ');
            arrrrr.forEach(function(tag){
                if (tag in tags) {
                  // If animal is present, increment the count
                  tags[tag] = tags[tag] + 1;
                } else {
                  // If animal is not present, add the entry
                  tags[tag] = 1;
                }
            });
   
        }

    }
    
    var putStyles = document.getElementById('allthestyles');
    putStyles.innerHTML = outputdata;
    
    //Create filter tags  DontShowAnyCountries
    var FilterOutput = '';
    var catsbox = document.getElementById('allcats');
    
    var sortedKeys = Object.keys(tags).sort().reduce((objEntries, key) => {
        objEntries[key] = tags[key];
        return objEntries;
    },{});
    
    Object.keys(sortedKeys).forEach(key => {
        if(sortedKeys[key]>1 && DontShowAnyCountries.includes(key)==false){
            let filtername = key.replace(/\\/g,'');
            FilterOutput = FilterOutput + '<span data-srch="' + filtername + '">' + filtername + ' <span>' + sortedKeys[key] +'</span></span>';    
        };
    });
    catsbox.innerHTML = FilterOutput;
    
    //Vars
    var filbut = document.querySelector('.filterbut');
    
    var clearbut = document.getElementById('clearsearch');
    var filters = document.querySelectorAll('#allcats span');
    var numlines = document.querySelectorAll('.numberline span');

    var pods = document.querySelectorAll('.stylepod');

    var typingTimer;               
    var typeInterval = 500;  
    var searchInput = document.getElementById('searchbox');
    searchInput.placeholder = 'Search ' + countstyles + ' Styles';
    
    var ratioInput = document.getElementById('ratiobox');

    var spans = document.getElementsByClassName('copyme');

    //Prompt Clipboard
    for(var i = 0; i < spans.length; i++){
        currentspan = spans[i];
        currentspan.addEventListener('click',function(){
            var inp = document.createElement('input');
            var alttxt = this.innerText;
            //console.log("Copy:", alttxt);
            document.body.appendChild(inp);
            inp.value = alttxt;
            inp.select();
            document.execCommand('copy',false);
            inp.remove();
            showSnackBar();
        });
    };

    //Style open/close
    if(pods){
        for(var i = 0; i < pods.length; i++){
            var currentpod = pods[i];
            currentpod.addEventListener('click',function(e){
            
                var cList = e.target.classList;
                if(cList.contains('copyme') || cList.contains('zoomimgsvg') || cList.contains('lookupartistsvg')){ return }
                //if(e.target.classList.contains('copyme')) return 
                this.classList.toggle('active');

                //Anchor in url bar
                var getnewanker = e.target.id;
                //console.log(getnewanker);
                if(!getnewanker){
                    const url = window.location.href.replace(/#.*/, "");
                    history.pushState({}, "", url);
                } else {
                    const url = window.location.href.replace(/#.*/, "") + '#' + getnewanker;
                    history.pushState({}, "", url);
                }

                let thishash = window.location.hash;
                if(thishash){
                    location.hash = thishash;
                }

            });
        };
    };

    //Check if Anchor in url
    if(window.location.hash){
        let thishash = window.location.hash;
        let thishashnew = thishash.replace('#','');
        if(thishash){
            let machaktiv = document.getElementById(thishashnew).classList.add('active');
            location.hash = thishash;
        }
    }

    //Filter
    if(filbut){
        filbut.onclick = function(e){
          e.preventDefault();
          catsbox.classList.toggle('show');
        };
    };
    if(clearbut){
        clearbut.onclick = function(e){
          e.preventDefault();
          document.getElementById('searchbox').value = '';
          liveSearch();
        };
    };

    if(filters){
        for(var i = 0; i < filters.length; i++){
            var currentfilter = filters[i];
            currentfilter.addEventListener('click',function(e){
                document.getElementById('searchbox').value = this.dataset.srch;
                liveSearch();
                catsbox.classList.toggle('show');
            });
        };
    };

    LL = new LazyLoad({});
    
    
    //Search - https://css-tricks.com/in-page-filtered-search-with-vanilla-javascript/
    function liveSearch(){
        let search_query = document.getElementById("searchbox").value;
        for(var i = 0; i < pods.length; i++) {
            //console.log(search_query.toLowerCase());
            if(pods[i].textContent.toLowerCase().includes(search_query.toLowerCase())){
                pods[i].classList.remove("is-hidden");
                clearbut.classList.remove('show');
            } else {
                pods[i].classList.add("is-hidden");
                clearbut.classList.add('show');
            }
        }
    }
    //A little delay
    if(searchInput){
        searchInput.addEventListener('keyup',()=>{
            clearTimeout(typingTimer);
            typingTimer = setTimeout(liveSearch, typeInterval);
        });
    };


    //Copy Notifier
    function showSnackBar(){
        var sb = document.getElementById("snackbar");
        sb.className = "show";
        setTimeout(()=>{ sb.className = sb.className.replace("show", ""); }, 1500);
    };
    
    //Image Ratio
    function ratioCalc(){
        let imgbasesize = document.getElementById("ratiobox").value;
        if(imgbasesize>0){
            document.getElementById("ir1b1").innerHTML = imgbasesize + ' &times; ' + imgbasesize;
            let twobythree = (imgbasesize / 2) * 3; document.getElementById("ir2b3").innerHTML = imgbasesize + ' &times; ' + Math.round(twobythree);
            let threebyfour = (imgbasesize / 3) * 4; document.getElementById("ir3b4").innerHTML = imgbasesize + ' &times; ' + Math.round(threebyfour);
            let fourbyfive = (imgbasesize / 4) * 5; document.getElementById("ir4b5").innerHTML = imgbasesize + ' &times; ' + Math.round(fourbyfive);
            let sixteenbynine = (imgbasesize / 9) * 16; document.getElementById("ir16b9").innerHTML = Math.round(sixteenbynine) + ' &times; ' + imgbasesize;
            let sixteenbyten = (imgbasesize / 10) * 16; document.getElementById("ir16b10").innerHTML = Math.round(sixteenbyten) + ' &times; ' + imgbasesize;
            let twentyonebynine = (imgbasesize / 9) * 21; document.getElementById("ir21b9").innerHTML = Math.round(twentyonebynine) + ' &times; ' + imgbasesize;
        }
    }

    //Imaga Ratio Delay
    if(ratioInput){
        ratioInput.addEventListener('keyup',()=>{
            clearTimeout(typingTimer);
            typingTimer = setTimeout(ratioCalc, typeInterval);
        });
    };
    
    //Click on 'Numberline' span
    if(numlines){
        for(var i = 0; i < numlines.length; i++){
            var currentnumlines = numlines[i];
            currentnumlines.addEventListener('click',function(e){
                ratioInput.value = this.innerText;
                ratioCalc();
            });
        };
    };
    
    
    
});
