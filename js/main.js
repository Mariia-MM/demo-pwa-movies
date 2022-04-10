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
        showFormAdd : false,
        newName : '',
        newDuration : '',
        isLoading: false,
        editableMovies : -1,
        editName : '',
        editDuration : ''

      }
    },
    methods: {
        getMovies: async function () {
           this.isLoading = true;
           const fetchMovies = await fetch(`${this.APIUrl}?select=*`,{headers});
           this.movies = await fetchMovies.json();
           this.isLoading = false;           
        },
        addMovie : async function (){
            this.isLoading = true;
            this.showFormAdd = false;

            //add new movie to dataBase
            const fetchMovies = await fetch(this.APIUrl,
                {
                    headers:headers,
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
            // delete visual
            this.$refs[`movie-${id}`][0].remove();

            // delete from data base
            const fetchMovies = await fetch(`${this.APIUrl}?id=eq.${id}`,
                {
                    headers:headers,
                    method: 'DELETE'
                });

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
                    headers:headers,
                    method: 'PATCH',
                    body : JSON.stringify({"name":this.editName, "duration" : this.editDuration})
                });
                this.getMovies();
                this.isLoading=false;

        },
    },
    watch : {
        isLoading(value){
            if(value){
                NProgress.start();
            } else {
                NProgress.done();
            }
        }

    },
    mounted: function() {
        this.getMovies();
    },

  }).mount('#app')