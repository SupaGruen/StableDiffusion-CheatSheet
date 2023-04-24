document.addEventListener("DOMContentLoaded",function(event){

    var DontShowAnyCountries = ['Sweden','USA','Ukraine','Belarus','Spain','Brazil','Denmark','Japan','Austria','France','Philippines','UK','Poland','Poland','Germany','Canada','Netherlands','Italy','Israel','Taiwan','Belgium','Russia','Australia','Czech Republic','Bulgaria','China'];

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
            
            let currentAnchor = data[i].Name.replace(/[^a-zA-Z]+/g,'');
            let catlist = data[i].Category.replace(/\\/g,'');
            let deathdate = ''; let dagger = ''; deathdate = data[i].Death;
            if(deathdate!=false){ dagger = '<sup> &dagger;</sup>'; }

            outputdata = outputdata + '<div id="' + currentAnchor + '" class="stylepod lazy" data-bg="./img/' + data[i].Image + '">';
            outputdata = outputdata + '<div class="styleinfo">';
            outputdata = outputdata + '<h3>' + data[i].Name + dagger + '</h3>';
            outputdata = outputdata + '<div class="more">';
            outputdata = outputdata + '<p class="category" title="' + catlist + '"><span>Category</span>' + catlist + '</p>';
            outputdata = outputdata + '<p class="checkpoint"><span>Checkpoint</span>' + data[i].Checkpoint + '</p>';
            outputdata = outputdata + '<fieldset><legend>Copy Prompt</legend><span class="copyme">' + data[i].Prompt + '</span></fieldset>';
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
                if(e.target.classList.contains('copyme')) return
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
    
});
