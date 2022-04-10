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
        newDuration : ''
      }
    },
    methods: {
        getMovies: async function () {
           NProgress.start();
           const fetchMovies = await fetch(`${this.APIUrl}?select=*`,{headers});
           this.movies = await fetchMovies.json();
           NProgress.done();           
        },
        addMovie : async function (){
            NProgress.start();
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
            NProgress.done();
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

        }
    },
    mounted: function() {
        this.getMovies();
    },

  }).mount('#app')