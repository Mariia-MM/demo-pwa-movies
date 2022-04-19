const headers = {
    'content-type': 'application/json',
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHJzZnRteGZqcHBsZmVkemZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk1OTc1NTYsImV4cCI6MTk2NTE3MzU1Nn0.AdxgEjqg0TpHyEO27ocvWi7m3fXdtT_fOiI8eXSB5IQ',
    'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdHJzZnRteGZqcHBsZmVkemZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk1OTc1NTYsImV4cCI6MTk2NTE3MzU1Nn0.AdxgEjqg0TpHyEO27ocvWi7m3fXdtT_fOiI8eXSB5IQ',
    
};


Vue.createApp({
    data() {
      return {
        movies : [],
        APIUrl: 'https://oftrsftmxfjpplfedzfl.supabase.co/rest/v1/Movies',
        UrlMovieAPI : 'http://www.omdbapi.com/?i=tt3896198&apikey=3106ae56&s=man',
        moviesFromAPI : [],
        showFormAdd : false,
        newName : '',
        newDuration : '',
        isLoading: false,
        moviesLength:0,
        editableMovies : -1,
        editName : '',
        editDuration : '',
        resultsNumberOnPage : 5,
        page : 1        
      }
    },
    computed:{
        getMaxPage(){
            return Math.ceil(this.moviesLength/this.resultsNumberOnPage);
        }
    },
    methods: {
        getMovies: async function () {
           this.isLoading = true;
           const fetchMovies = await fetch(`${this.APIUrl}?select=*`,{headers: this.getHeaders()});
           this.movies = await fetchMovies.json();
           this.isLoading = false;           
        },
        addMovie : async function (){
            this.isLoading = true;
            this.showFormAdd = false;

            //add new movie to dataBase
            const fetchMovies = await fetch(this.APIUrl,
                {
                    headers: this.getHeaders(),
                    method: 'POST',
                    body : JSON.stringify({"name":this.newName, "duration" : this.newDuration})
                });

            //renew the form
            this.newName = '';
            this.newDuration = '';
            //getting again all movies
            this.getMovies();
            this.isLoading = false;
        },
        deleteMovie : async function (id){
            // // delete visual
            // this.$refs[`movie-${id}`][0].remove();

            // delete from data base
            await fetch(`${this.APIUrl}?id=eq.${id}`,
                {
                    headers: this.getHeaders(),
                    method: 'DELETE'
                }
                );
                this.getMovies();

        },
        editShowMovie: function(id){
            //show the camp for edit
            this.editableMovies = id;
            //get the data
            const editableMovie = this.movies.filter(function(movie){
                return movie.id === id;
            })[0];
            
            //show data
            this.editName = editableMovie.name;
            this.editDuration = editableMovie.duration;
        },
        editMovie : async function (id){
            this.isLoading=true;
            this.editableMovies = -1;
            const fetchMovies = await fetch(`${this.APIUrl}?id=eq.${id}`,
                {
                    headers: this.getHeaders(),
                    method: 'PATCH',
                    body : JSON.stringify({"name":this.editName, "duration" : this.editDuration})
                });
                this.getMovies();
                this.isLoading=false;
        },
        getMoviesFromAPI : async function(){
            const myFetch = await fetch(this.UrlMovieAPI);
            const jsonData = await myFetch.json();
            this.moviesFromAPI = jsonData.Search;
            console.log(this.moviesFromAPI);  
            this.pushMoviesIntoBD();          
        },
        pushMoviesIntoBD : function(){
            this.moviesFromAPI.forEach((movie) => {
                //console.log(movie.Title);
                fetch (this.APIUrl,
                    {
                        headers: this.getHeaders(),
                        method:'POST',
                        body: JSON.stringify({"name":movie.Title, "duration" : 60})
                    })
                
            });
        },
        getHeaders() {
            const rangeStart=(this.page - 1) * this.resultsNumberOnPage;
            const rangeFinish = rangeStart + this.resultsNumberOnPage;
            
            //clone headers
            let headersNewRange = JSON.parse(JSON.stringify(headers));
            //modifying the range
            headersNewRange.Range = `${rangeStart}-${rangeFinish}`;            
            return headersNewRange;
        },
        async getMoviesLength (){
            //get headers without changing range for paging
            const myHeaders = this.getHeaders();
            myHeaders.Range='';
            // get the list of all movies tor to get the quantity
            const fetchMovies = await fetch(`${this.APIUrl}?select=*`,{headers: myHeaders});
            const dataMovies = await fetchMovies.json();
            this.moviesLength=Math.ceil(dataMovies.length/this.resultsNumberOnPage);

        },
    },
    watch : {
        isLoading(value){
            if(value){
                NProgress.start();
            } else {
                NProgress.done();
            }
        },
        page(value){
            this.getMovies();
            this.getMoviesLength();
        }

    },
    mounted: function() {
        this.getMovies();        
        this.getMoviesLength();
        
    },

  }).mount('#app')