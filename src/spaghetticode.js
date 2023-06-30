document.addEventListener('DOMContentLoaded',function(event){

    var SearchEngine = 'https://www.google.com/search?q=';
    
    var EndOfLastVer120 = 202306072133; // Version 1.2.0
    var EndOfLastVer110 = 202305050000; // Version 1.1.0

    // Filter Buttons - Don't show countries or tags that are too common
    var DontShowAnyCountries = ['Blizzard','DC Comics','Disney','Marvel','MTG','Tolkien','Oil','Painting','Illustration','Portrait','Character Design','Cover Art','Print','Concept Art','Ireland','Scotland','Norway','Mexico','Ireland','Lithuania','Sweden','South Korea','Portugal','Switzerland','USA','Ukraine','Belarus','Spain','Brazil','Denmark','Japan','Austria','France','Philippines','UK','Poland','Poland','Germany','Canada','Netherlands','Italy','Israel','Taiwan','Belgium','Russia','Australia','Czech Republic','Bulgaria','Turkey','China'];

    // ----------------------

    var outputdata = '';
    var FilterOutput = '';
    var tags = [];
    var countstyles = 0;
    var typingTimer;
    var typeInterval = 500;
    var pages = document.querySelectorAll('section');
    var menulinks = document.querySelectorAll('.mbut');
    var searchdiv = document.getElementById('suche');
    var searchInput = document.getElementById('searchbox');
    var ratioInput = document.getElementById('ratiobox');
    var filbut = document.querySelector('.filterbut');
    var clearbut = document.getElementById('clearsearch');
    var numlines = document.querySelectorAll('.numberline span');
    var catsbox = document.getElementById('allcats');
    var metadatawrapper = document.getElementById('metadataboxes');
    var dropArea = document.getElementById('drop-area');
    var allMetaData = document.getElementById('allMetaData');
    
    const titletexts = [];
    titletexts[404] = 'Artist not known';
    titletexts[304] = 'Something is recognized, but it\'s not related to the artist';
    titletexts[301] = 'Something is recognized, but results are too different';
    titletexts[205] = 'Artist is recognized, but difficult to prompt/not flexible';
    titletexts[204] = 'Artist is recognized, but too different/generic';
    titletexts[500] = 'Other';
    
    // Prepare Liked Styles
    var mystars = localStorage.getItem('mystars');
    if(mystars == null){ var mystars = []; } else {
        mystars = JSON.parse(mystars);
    }
    var starsexport = document.getElementById('starsexport');
    starsexport.value = mystars;
    
    // Initialize Sections as 'Pages'
    function hidepages(){
        if(pages){
            for(var i = 0; i < pages.length; i++){ pages[i].classList.add('is-hidden'); }
            for(var i = 0; i < menulinks.length; i++){ menulinks[i].classList.remove('active'); }
            searchdiv.classList.add('is-hidden'); //hide search box
            document.getElementById('allcats').classList.remove('show'); //hide filters
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
                hidepages(); //hide everything first
                window.scroll(0, 100); //scroll up
                document.getElementById(mldata).classList.remove('is-hidden'); //display div that has id of menu links data
                this.classList.add('active'); //activate current menu link
                if(mldata=='styles'){ searchdiv.classList.remove('is-hidden'); }; //display search box if styles
            });
        };
    };
    
    // Copy Categories Checkbox
    var CopyCatCheckbox = document.getElementById('copycat');
    if(localStorage.getItem('copycat')){
        CopyCatCheckbox.checked = true;
    }
    CopyCatCheckbox.addEventListener('click',function(e){
        if(CopyCatCheckbox.checked){
            localStorage.setItem('copycat','1');
            location.reload(); 
        } else {
            localStorage.removeItem('copycat');
            location.reload(); 
        }
    });
    
    // Put JSON in DOM
    function buildstyles(){
    
        for(var i=0; i<data.length; i++){

            if(data[i].Type==1){

                let CurrentArtistName = data[i].Name;
                let currentAnchor = removedia(CurrentArtistName); // remove special characters (diacritics)
                currentAnchor = currentAnchor.replace(/[^a-zA-Z]+/g,'-').replace(/^-+/,'').replace(/-+$/,''); // replace everything thats not a letter with a dash, trim dash from front and back
                let catlist = data[i].Category.replace(/\\/g,''); //remove backslash

                let buildcatlist = catlist.split(',');
                let buildcatlistoutput = '';
                buildcatlist.forEach(function(value){ //build output without first
                    buildcatlistoutput = buildcatlistoutput + '<span>' + value.trim() + '</span>';
                });

                let deathdate = ''; let dagger = ''; deathdate = data[i].Death;
                if(deathdate!=false){ dagger = '<sup> &dagger;</sup>'; }

                const lookupArray = CurrentArtistName.replace(/ *\([^)]*\) */g, '').split(',').map(function(item){ return item.trim(); }); //remove braces, split at comma, trim spaces
                let LUPart1 = lookupArray[0];
                let LUPart2 = lookupArray[1];
                if(LUPart2){ var LUArtist = SearchEngine + LUPart2 + '%20' + LUPart1; } else { var LUArtist = SearchEngine + LUPart1; } //if no comma in name 
                if(mystars.includes(data[i].Creation)){ var stylestar = ' stared'; } else { var stylestar = ''; }

                let extraclass = '';
                if(localStorage.getItem('copycat')){ extraclass = ' copythecats'; }

                outputdata = outputdata + '<div id="' + currentAnchor + '" class="stylepod lazy" data-creatime="' + data[i].Creation + '" data-bg="./img/' + data[i].Image + '">';
                outputdata = outputdata + '<div class="styleinfo">';
                outputdata = outputdata + '<h3 title="' + data[i].Name + '">' + data[i].Name + dagger + '</h3>';
                outputdata = outputdata + '<div class="more">';
                outputdata = outputdata + '<p class="category' + extraclass + '" title="' + catlist + '"><span class="checkpointname">' + data[i].Checkpoint + '</span>' + buildcatlistoutput + '</p>';
                outputdata = outputdata + '<span class="clicklinks"><fieldset><legend>Copy Prompt</legend><span class="copyme">' + data[i].Prompt + '</span></fieldset>';
                outputdata = outputdata + '<p class="extralinks"><a class="zoomimg" title="Zoom" href="./img/' + data[i].Image + '" target="_blank"><img src="./src/zoom-white.svg" width="25" alt="Zoom"><span class="elsp">Zoom</span></a><a href="' + LUArtist + '" title="Look Up Artist" target="_blank" class="lookupartist"><img src="./src/magnifying-glass-white.svg" width="25" alt="Look Up Artist"><span class="elsp">Look Up</span></a><a class="starthis' + stylestar + '" title="Mark as Favorite"><img class="svg" src="./src/heart-outline-white.svg" width="25" title="Mark as Favorite"></a></p></span>';
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
                      tags[tag] = tags[tag] + 1;
                    } else {
                      tags[tag] = 1;
                    }
                });

            }

        }
        var putStyles = document.getElementById('allthestyles');
        putStyles.innerHTML = '';
        putStyles.innerHTML = outputdata;
    }
    buildstyles();
    searchInput.placeholder = 'Search ' + countstyles + ' Styles';
    
    // Create filter tags
    var sortedKeys = Object.keys(tags).sort().reduce((objEntries, key) => {
        objEntries[key] = tags[key];
        return objEntries;
    },{});
    
    Object.keys(sortedKeys).forEach(key => {
        if(sortedKeys[key]>2 && DontShowAnyCountries.includes(key)==false){
            let filtername = key.replace(/\\/g,'');
            FilterOutput = FilterOutput + '<span data-srch="' + filtername + '">' + filtername + ' <span>' + sortedKeys[key] +'</span></span>';    
        };
    });
    FilterOutput =  FilterOutput + '<span class="specialfilters" data-srch="New Styles 1.2.0">New with 1.2.0</span><span class="specialfilters" data-srch="New Styles 1.1.0">New with 1.1.0</span><span class="specialfilters" data-srch="Opened Styles">Currently Opened Styles</span><span class="specialfilters" data-srch="Liked">Liked <span><img class="svg" src="./src/heart-outline.svg" width="12"></span></span><span class="specialfilters" data-srch="&dagger;">Only Deceased Artists <span>&dagger;</span></span>';
    catsbox.innerHTML = FilterOutput;
    
    // Copy Prompt to Clipboard
    function addcopylistener(e,f){
        for(var i = 0; i < e.length; i++){
            currentspan = e[i];
            currentspan.addEventListener('click',function(){
                var inp = document.createElement('input');
                document.body.appendChild(inp);
                if(f == 'no'){
                var alttxt = this.title;
                } else {
                var alttxt = this.innerText;
                }
                inp.value = alttxt;
                inp.select();
                document.execCommand('copy',false);
                inp.remove();
                showSnackBar();
            });
        };
    };
    var spans = document.getElementsByClassName('copyme');
    var categorytags = document.getElementsByClassName('copythecats');
    addcopylistener(spans);
    addcopylistener(categorytags,'no');
    
    // Remove Diacritics (Special Characters)
    function removedia(e){
        let updatedstring = e.normalize('NFD').replace(/\p{Diacritic}/gu,'');
        return updatedstring;
    };

    // Styles open/close
    var pods = document.querySelectorAll('.stylepod');
    if(pods){
        for(var i = 0; i < pods.length; i++){
            var currentpod = pods[i];
            currentpod.addEventListener('click',function(e){
            
                var cList = e.target.classList;
                let parentclasses = e.target.parentElement.classList; // need this for category copy
                
                if(cList.contains('copyme') || parentclasses.contains('copythecats') || cList.contains('extralinks') || cList.contains('elsp') || cList.contains('zoomimg') || cList.contains('lookupartist') || cList.contains('starthis') || cList.contains('svg')){ return }
                this.classList.toggle('active');

                //Anchor in url bar
                var getnewanker = e.target.id; // hehe
                
                if(!getnewanker){
                    const url = window.location.href.replace(/#.*/, '');
                    history.pushState({}, '', url);
                } else {
                    const url = window.location.href.replace(/#.*/, '') + '#' + getnewanker;
                    history.pushState({}, '', url);
                }

                let thishash = window.location.hash;
                if(thishash){
                    location.hash = thishash;
                }

            });
        };
    };

    //Stars - Favorite Styles
    function starfunction(e){
        if(mystars.includes(e)){
            let starindex = mystars.indexOf(e);
            let spliced = mystars.splice(starindex,1);
            localStorage.setItem('mystars',JSON.stringify(mystars));
            if(searchInput.value == 'Liked'){
                liveSearch();
            }
        } else {
            mystars.push(e);
            localStorage.setItem('mystars',JSON.stringify(mystars));
        }
        starsexport.value = mystars;
    };
    if(pods){
        var starbuts = document.querySelectorAll('.starthis');
        if(starbuts){
            for(var i = 0; i < starbuts.length; i++){
                currentstar = starbuts[i];
                currentstar.addEventListener('click',function(e){
                    e.preventDefault();
                    let starbutstyledata = this.closest('.stylepod').dataset.creatime;
                    starfunction(starbutstyledata);
                    this.classList.toggle('stared');
                });
            };
        };
    };
    // Import Styles
    var StyleDialog = document.getElementById('stylesDialog');
    document.getElementById('importstyles').addEventListener('click',function(e){
        StyleDialog.showModal();
    });
    document.getElementById('stylesDialogConfirm').addEventListener('click',(event) => {
        var eximp = document.getElementById('starsexport').value;
        event.preventDefault();
        StyleDialog.close();
        var sanitizeInput = eximp.replace(/[^\d,]+/g,''); // only numbers and commas
        var newStyleInputarray = sanitizeInput.split(',').map(function(n){ return Number(n); });
        newStyleInputarray = newStyleInputarray.filter(val => val != '0');
        for(var i = 0; i < newStyleInputarray.length; i++){
            newStyleInputarray[i] = newStyleInputarray[i].toString(); // need strings instead of numbers
        }
        localStorage.setItem('mystars',JSON.stringify(newStyleInputarray));
        location.reload(); //need top update style list to update likes -> page reload
    });


    // Check if Anchor in url
    function hashcheck(){
        if(window.location.hash){
            let thishash = window.location.hash;
            let thishashnew = thishash.replace('#','');
            if(thishash){
                let machaktiv = document.getElementById(thishashnew).classList.add('active');
                location.hash = thishash;
            }
        }
    };
    hashcheck();

    // Filter
    if(filbut){
        filbut.onclick = function(e){
          e.preventDefault();
          filbut.classList.toggle('active');
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

    var filters = document.querySelectorAll('#allcats span');
    if(filters){
        for(var i = 0; i < filters.length; i++){
            var currentfilter = filters[i];
            currentfilter.addEventListener('click',function(e){
                document.getElementById('searchbox').value = this.dataset.srch;
                liveSearch();
                catsbox.classList.toggle('show');
                filbut.classList.toggle('active');
            });
        };
    };

    // Initialize Lazy Loading
    LL = new LazyLoad({});
    
    // Fill Search Array for Similar Names + Not Available Artists
    // https://github.com/aceakash/string-similarity
    !function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.stringSimilarity=e():t.stringSimilarity=e()}(self,(function(){return t={138:t=>{function e(t,e){if((t=t.replace(/\s+/g,""))===(e=e.replace(/\s+/g,"")))return 1;if(t.length<2||e.length<2)return 0;let r=new Map;for(let e=0;e<t.length-1;e++){const n=t.substring(e,e+2),o=r.has(n)?r.get(n)+1:1;r.set(n,o)}let n=0;for(let t=0;t<e.length-1;t++){const o=e.substring(t,t+2),s=r.has(o)?r.get(o):0;s>0&&(r.set(o,s-1),n++)}return 2*n/(t.length+e.length-2)}t.exports={compareTwoStrings:e,findBestMatch:function(t,r){if(!function(t,e){return"string"==typeof t&&!!Array.isArray(e)&&!!e.length&&!e.find((function(t){return"string"!=typeof t}))}(t,r))throw new Error("Bad arguments: First argument should be a string, second should be an array of strings");const n=[];let o=0;for(let s=0;s<r.length;s++){const i=r[s],f=e(t,i);n.push({target:i,rating:f}),f>n[o].rating&&(o=s)}return{ratings:n,bestMatch:n[o],bestMatchIndex:o}}}}},e={},function r(n){if(e[n])return e[n].exports;var o=e[n]={exports:{}};return t[n](o,o.exports,r),o.exports}(138);var t,e}));
    
    var searcharray = [];
    var simplearray = [];

    for(var i=0; i<data.length; i++){
        const lookupArray = data[i].Name.split(',').map(function(item){ return item.trim(); }); //remove braces, split at comma, trim spaces
        let LUPart1 = lookupArray[0]; let LUPart2 = lookupArray[1];
        if(LUPart2){ var LUArtist = LUPart2 + ' ' + LUPart1; } else { var LUArtist = LUPart1; }
        
        searcharray.push({'ArtistName':LUArtist,'Status':200});
        simplearray.push(LUArtist);
    };
    for(var i=0; i<exclArtists.length; i++){
        let LUPart1 = exclArtists[i].Name; let LUPart2 = exclArtists[i].FirstName;
        if(LUPart2){ var LUArtist = LUPart2 + ' ' + LUPart1; } else { var LUArtist = LUPart1; }
        let AStatus = exclArtists[i].Code;
        
        searcharray.push({'ArtistName':LUArtist,'Status':AStatus});
        simplearray.push(LUArtist);
    };
    
    // Search - https://css-tricks.com/in-page-filtered-search-with-vanilla-javascript/
    function liveSearch(){
        let search_query = document.getElementById('searchbox').value;
        let stylebegindate; let styleenddate;
        if(search_query == 'New Styles 1.1.0'){ stylebegindate = EndOfLastVer110; styleenddate = EndOfLastVer120; }
        if(search_query == 'New Styles 1.2.0'){ stylebegindate = EndOfLastVer120; styleenddate = 999999999999; }
        
        for(var i = 0; i < pods.length; i++){
            
            if((search_query == 'New Styles 1.1.0')||(search_query == 'New Styles 1.2.0')){
                let currentstyledate = pods[i].dataset.creatime;
                if((currentstyledate>stylebegindate)&&(currentstyledate<styleenddate)){
                    pods[i].classList.remove('is-hidden');
                    clearbut.classList.remove('show');
                } else {
                    pods[i].classList.add('is-hidden');
                }
            } else if(search_query == 'Opened Styles'){
                let currentclasses = pods[i].classList.contains('active');
                if(currentclasses){
                    pods[i].classList.remove('is-hidden');
                    clearbut.classList.remove('show');
                } else {
                    pods[i].classList.add('is-hidden');
                }
            } else if(search_query == 'Liked'){
                let currentstyledate = pods[i].dataset.creatime;
                if(mystars.includes(currentstyledate)){
                    pods[i].classList.remove('is-hidden');
                    clearbut.classList.remove('show');
                } else {
                    pods[i].classList.add('is-hidden');
                }
            } else {
                if(removedia(pods[i].textContent.toLowerCase()).includes(removedia(search_query.toLowerCase()))){
                    pods[i].classList.remove('is-hidden');
                    clearbut.classList.remove('show');
                } else {
                    pods[i].classList.add('is-hidden');
                }
            }
            
            if(search_query){ clearbut.classList.add('show'); } //also catches single html-entities like the cross
            
        }
        
        // Display Unavailable Artists in Search Results
        let countshownstyles = 0;
        let currentpods = document.querySelectorAll('.stylepod');
        for(var i = 0; i < currentpods.length; i++){
            let vstatus = currentpods[i].classList;
            if(!vstatus.contains('is-hidden')){ countshownstyles = countshownstyles + 1; }
        }
        var searchinfo = document.getElementById('searchinfo');
        var notavail = document.getElementById('notavail');
        var matches = stringSimilarity.findBestMatch(search_query, simplearray);
        
        if(matches){
            var getSimilar = [];
            for(var i in matches.ratings){
                if(matches.ratings[i].rating > 0.4){
                    getSimilar.push(matches.ratings[i].target);
                }
            }
            
            var allarrayresults = '';
            var onlyavailable = '';
            for(var i = 0; i < getSimilar.length; i++){
                var thisperson = searcharray.filter(function(person){ return person.ArtistName == getSimilar[i] });
                let currentAnchor = removedia(thisperson[0].ArtistName); // remove special characters (diacritics)
                currentAnchor = currentAnchor.replace(/[^a-zA-Z]+/g,'-').replace(/^-+/,'').replace(/-+$/,''); // replace everything thats not a letter with a dash, trim dash from front and back
                
                if(thisperson[0].Status!=200){
                    allarrayresults = allarrayresults + '<a href="./only-data.html#' + currentAnchor + '" target="_onlydata" class="ASearchStatus' + thisperson[0].Status + '" title="' + titletexts[thisperson[0].Status] + '">' + thisperson[0].ArtistName + '</a>';
                } else {
                    onlyavailable = onlyavailable + '<span class="ASearchStatus' + thisperson[0].Status + '">' + thisperson[0].ArtistName + '</span>';
                }
            }
        }
        
        if((countshownstyles!=0)&&(search_query!=0)){
            searchinfo.innerHTML = ' - ' + search_query + ' (' + countshownstyles + ')'; notavail.innerHTML = '';
            if(allarrayresults){ notavail.innerHTML = 'Similar names of <a href="./only-data.html#notavailable" class="internal">artists that are unavailable</a>: <span id="naaresults">' + allarrayresults + '</span>'; }
        } else if((countshownstyles==0)&&(search_query!=0)) {
            searchinfo.innerHTML = ''; notavail.innerHTML = '';
            if(allarrayresults){ notavail.innerHTML = 'Checking for similar names and <a href="./only-data.html#notavailable" class="internal">artists that are unavailable</a>: <span id="naaresults">' + onlyavailable + allarrayresults + '</span>'; }
        } else {
            searchinfo.innerHTML = ''; notavail.innerHTML = '';
        }
        
        // Click on Similar Name Search Result
        var similars = document.getElementsByClassName('ASearchStatus200');
        if(similars){
            for(var i = 0; i < similars.length; i++){
                currentspan = similars[i];
                currentspan.addEventListener('click',function(){
                    document.getElementById('searchbox').value = this.innerText;
                    liveSearch();
                });
            };
        };
        
    }
    
    // A little delay
    if(searchInput){
        searchInput.addEventListener('keyup',()=>{
            clearTimeout(typingTimer);
            typingTimer = setTimeout(liveSearch, typeInterval);
        });
    };

    // Copy Notifier
    function showSnackBar(){
        var sb = document.getElementById('snackbar');
        sb.className = 'show';
        setTimeout(()=>{ sb.className = sb.className.replace('show', ''); }, 1500);
    };
    
    // Image Ratio Calculation
    function ratioCalc(){
        let imgbasesize = document.getElementById('ratiobox').value;
        if(imgbasesize>0){
            document.getElementById('ir1b1').innerHTML = imgbasesize + ' &times; ' + imgbasesize;
            let twobythree = (imgbasesize / 2) * 3; document.getElementById('ir2b3').innerHTML = imgbasesize + ' &times; ' + Math.round(twobythree);
            let threebyfour = (imgbasesize / 3) * 4; document.getElementById('ir3b4').innerHTML = imgbasesize + ' &times; ' + Math.round(threebyfour);
            let fourbyfive = (imgbasesize / 4) * 5; document.getElementById('ir4b5').innerHTML = imgbasesize + ' &times; ' + Math.round(fourbyfive);
            let sixteenbynine = (imgbasesize / 9) * 16; document.getElementById('ir16b9').innerHTML = Math.round(sixteenbynine) + ' &times; ' + imgbasesize;
            let sixteenbyten = (imgbasesize / 10) * 16; document.getElementById('ir16b10').innerHTML = Math.round(sixteenbyten) + ' &times; ' + imgbasesize;
            let twentyonebynine = (imgbasesize / 9) * 21; document.getElementById('ir21b9').innerHTML = Math.round(twentyonebynine) + ' &times; ' + imgbasesize;
        }
    }
    // Imaga Ratio Delay
    if(ratioInput){
        ratioInput.addEventListener('keyup',()=>{
            clearTimeout(typingTimer);
            typingTimer = setTimeout(ratioCalc, typeInterval);
        });
    };
    // Click on 'Numberline' span
    if(numlines){
        for(var i = 0; i < numlines.length; i++){
            var currentnumlines = numlines[i];
            currentnumlines.addEventListener('click',function(e){
                ratioInput.value = this.innerText;
                ratioCalc();
            });
        };
    };
    
    // Arthistory Clicks
    var artlinks = document.getElementById('arthistory').getElementsByTagName('a');
    if(artlinks){
        for(var i = 0; i < artlinks.length; i++){
            var currentartlink = artlinks[i];
            currentartlink.addEventListener('click',function(e){
                let lala = this.getAttribute('href'); //get href from link
                let thislalanew = lala.replace('./index.html#',''); //get hashtag from link
                if(thislalanew){
                    document.getElementById(thislalanew).classList.add('active'); //make sure style is open
                }
                hidepages(); //hide all pages
                document.querySelector('[data-page="styles"]').classList.add('active'); //styles menu link active
                document.getElementById('styles').classList.remove('is-hidden'); //activate styles div
                searchdiv.classList.remove('is-hidden'); //activate filter/search
            });
        };
    };
    
    // Start of Metadata Viewer
    
    // Drag and Drop Start
    // Joseph Zimmerman - https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/

    // Prevent default drag behaviors
    ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false)   
      document.body.addEventListener(eventName, preventDefaults, false)
    })

    // Highlight drop area when item is dragged over it
    ;['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false)
    })

    ;['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false)
    })

    // Handle dropped files
    dropArea.addEventListener('drop', handleDrop, false)

    function preventDefaults (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    function highlight(e) {
      dropArea.classList.add('highlight')
    }

    function unhighlight(e) {
      dropArea.classList.remove('active')
    }

    function handleDrop(e) {
      var dt = e.dataTransfer
      var files = dt.files

      handleFiles(files)
    }

    function handleFiles(files) {
      files = [...files]
      files.forEach(previewFile)
    }

    // Drag and Drop end


    // Remove Metadata Image
    document.getElementById('clearimage').addEventListener('click',function(e){
        document.getElementById('my-form').reset();
        allMetaData.innerHTML = '';
        document.getElementById('gallery').innerHTML = '';
        metadatawrapper.classList.remove('hasimg');
    });

    
    // EXIF Start
    
    async function previewFile(file) {    

        let reader = new FileReader()
        reader.readAsDataURL(file)

        // when loaded, put image in DOM
        reader.onloadend = function() {
        let img = document.createElement('img')
            img.setAttribute('id','thisimg');
            img.src = reader.result;
            document.getElementById('gallery').innerHTML = '';
            document.getElementById('gallery').appendChild(img);
            metadatawrapper.classList.add('hasimg');
        }

        const tags = await ExifReader.load(file).catch(error => { allMetaData.innerHTML = '<p>No EXIF data detected</p>'; });
        if(tags){ getComment(tags); }

        // https://www.geeksforgeeks.org/how-to-convert-special-characters-to-html-in-javascript/
        function Encode(string) {
            var i = string.length,
                a = [];
  
            while (i--) {
                var iC = string[i].charCodeAt();
                if (iC < 65 || iC > 127 || (iC > 90 && iC < 97)) {
                    a[i] = '&#' + iC + ';';
                } else {
                    a[i] = string[i];
                }
            }
            return a.join('');
        }


        // https://github.com/himuro-majika/Stable_Diffusion_image_metadata_viewer
        function getComment(tags) {
            //console.dir(JSON.parse(JSON.stringify(tags)));
            let com = '';

            // Exif - JPG
            if(tags && tags.UserComment) {
                com = decodeUnicode(tags.UserComment.value);
                extractPrompt(com);
                return;
            }
            // A1111 - PNG
            if(tags.parameters) {
                com = tags.parameters.description;
                extractPrompt(com);
                return;
            }
            
            // Non SD image but tags
            if(tags && (tags.UserComment === undefined) && (tags.parameters === undefined)) {
                function printValues(obj) {
                    for(var k in obj) {
                        if(!(k=='value'||k=='Thumbnail'||k=='Special Instructions'||k=='Padding')){
                            if(obj[k] instanceof Object) {
                                tagoutput = tagoutput + '<br>' + k + ': ';
                                printValues(obj[k]);
                            } else {
                                tagoutput = tagoutput + obj[k] + ' ';
                            };
                        };
                    }
                };
                
                let tagoutput = '';
                var test1 = JSON.stringify(tags).replace(/(^,)|(,$)/g,""); //trim commas to prevent JSON parse error
                var tagsobj = JSON.parse(test1);
                printValues(tagsobj);
                allMetaData.innerHTML = '<p>No Stable Diffusion EXIF data detected</p><p>' + tagoutput + '</p>';
            }
        }

        function decodeUnicode(array) {
            const plain = array.map(t => t.toString(16).padStart(2, '0')).join('');
            if (!plain.match(/^554e49434f44450/)) {
                return;
            }
            const hex = plain.replace(/^554e49434f44450[0-9]/, '').replace(/[0-9a-f]{4}/g, ',0x$&').replace(/^,/, '');
            const arhex = hex.split(',');
            let decode = '';
            arhex.forEach(v => {
                decode += String.fromCodePoint(v);
            })
            return decode;
        }

        function extractPrompt(com) {

            const positive = Encode(extractPositivePrompt(com));
            const negative = Encode(extractNegativePrompt(com));
            const others = extractOthers(com); //is encoded while building the output below
            const PluginMetaData = Encode(extractPluginData(com));
            
            if (!positive && !negative && !others) return;
            const prompt = {
                positive: positive,
                negative: negative,
                others: others,
                PMother: PluginMetaData,
                originalMD: com
            }
            makeData(prompt);
        }

        function makeData(prompt) {
            const positive = prompt.positive;
            const negative = prompt.negative;
            const others = prompt.others;
            const PluginMetaData = prompt.PMother;

            const Allothers = others.split(', ');
            let NewOthers = '';
            let UpscaledTo = '';
            
            const UpscaleFound = Allothers.find(v => v.includes('upscale'));
            
            for(var i=0; i<Allothers.length; i++){
                let oother = Allothers[i].split(':');
                let escapedsecondpart = '';
                if(oother[1]){ escapedsecondpart = Encode(oother[1]); } else { escapedsecondpart = oother[1]; }
                
                let IMGOW = document.getElementById('thisimg').naturalWidth;
                let IMGOH = document.getElementById('thisimg').naturalHeight;
                if(oother[0]=='Size' && UpscaleFound){ UpscaledTo = ' <span>[&nearr; ' + IMGOW + 'x' + IMGOH + ']</span>'; } else { UpscaledTo = ''; }
                
                NewOthers = NewOthers + '<span><strong>' + oother[0] + '</strong>' + escapedsecondpart + UpscaledTo + '</span>';
            };

            let MDOut = '';
            if(positive){ MDOut = MDOut + '<p><strong>Prompt</strong><br>' + positive + '</p>'; }
            if(negative){ MDOut = MDOut + '<p><strong>Negative Prompt</strong><br>' + negative + '</p>'; }
            if(NewOthers){ MDOut = MDOut + '<p>' + NewOthers + '</p>'; }
            if(PluginMetaData){ MDOut = MDOut + '<p><strong>Other Metadata</strong><br>' + PluginMetaData + '</p>'; }

            let copymetadataprompt = '<span id="copyprompt">' + Encode(prompt.originalMD) + '</span><button id="copypromptbutton">Copy Prompt</button>';

            allMetaData.innerHTML = MDOut + copymetadataprompt;
            
            document.getElementById('copypromptbutton').addEventListener('click',function(e){
                var inp = document.createElement('textarea');
                var txt = document.getElementById('copyprompt').innerText;
                document.body.appendChild(inp);
                inp.value = txt;
                inp.select();
                document.execCommand('copy',false);
                inp.remove();
                showSnackBar();
            });

        }

        function extractPositivePrompt(text) {
            try {
                let matchtext = 
                text.match(/([^]+)Negative prompt: /) || 
                text.match(/([^]+)Steps: /) || 
                text.match(/([^]+){"steps"/) ||
                text.match(/([^]+)\[[^[]+\]/);
                return matchtext[1];
            } catch (e) {
                return '';
            }
        }

        function extractNegativePrompt(text) { // removed b/c false negative from checkpoint name in square braces -> || text.match(/\[([^[]+)\]/)
            try {
                let matchtext = 
                text.match(/Negative prompt: ([^]+)Steps: /) || 
                text.match(/"uc": "([^]+)"}/);
                return matchtext[1];
            } catch (e) {
                return '';
            }
        }

        function extractOthers(text) {
            try {
                let matchtext = 
                text.match(/(Steps: [^]+)/) || 
                text.match(/{("steps"[^]+)"uc": /) ||
                text.match(/\]([^]+)/);
                
                //in case there is more after the positive/negative and steps part, we check for line breaks
                var separateLines = matchtext[1].match(/[^\r\n]+/g);
                //return matchtext[1];
                return separateLines[0];
            } catch (e) {
                return text;
            }
        }
        
        function extractPluginData(text) {
            try {
                let matchtext = 
                text.match(/(Steps: [^]+)/) || 
                text.match(/{("steps"[^]+)"uc": /) ||
                text.match(/\]([^]+)/);
                
                var separateLines = matchtext[1].match(/[^\r\n]+/g);
                let returnthis = '';
                separateLines.slice(1).forEach(function(value){ //build output without first
                    returnthis = returnthis + value;
                });
                return returnthis;
            } catch (e) {
                return text;
            }
        }

    }

});
