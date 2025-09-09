$(function() {
  // Button will be disabled until we type anything inside the input field
  const source = document.getElementById('autoComplete');
  const inputHandler = function(e) {
    if(e.target.value==""){
      $('.movie-button').attr('disabled', true);
    }
    else{
      $('.movie-button').attr('disabled', false);
    }
  }
  source.addEventListener('input', inputHandler);

  $('.movie-button').on('click',function(){
    var title = $('.movie').val();
    if (title=="") {
      $('.results').css('display','none');
      $('.fail').css('display','block');
    }
    else{
      load_details(title);
    }
  });
  
  // CRITICAL: Initialize Bootstrap modal functionality immediately
  initializeBootstrapModals();
});

function initializeBootstrapModals() {
  // Ensure Bootstrap modals work independently
  $(document).off('click', '.modal .close[data-dismiss="modal"]');
  $(document).off('click', '.modal [data-dismiss="modal"]');
  
  // Force Bootstrap modal close functionality with highest priority
  $(document).on('click.bootstrap-modal', '.modal .close[data-dismiss="modal"]', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const modal = $(this).closest('.modal');
    modal.modal('hide');
    return false;
  });
  
  $(document).on('click.bootstrap-modal', '.modal [data-dismiss="modal"]', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const modal = $(this).closest('.modal');
    modal.modal('hide');
    return false;
  });
  
  // Allow ESC key to close Bootstrap modal
  $(document).on('keydown.bootstrap-modal', function(e) {
    if (e.keyCode === 27 && $('.modal.show').length > 0) {
      $('.modal.show').modal('hide');
    }
  });
}

// will be invoked when clicking on the recommended movies
function recommendcard(e){
  var title = e.getAttribute('title'); 
  // Close current modal first
  $('#movieModal').fadeOut(300);
  // Wait a bit then load new movie details
  setTimeout(() => {
    load_details(title);
  }, 400);
}

// get the basic details of the movie from the API (based on the name of the movie)
function load_details(title){
  $.ajax({
    type: 'POST',
    url:'/get_movie_details',
    data: {'title': title},
    success: function(response){
      if(response.error){
        $('.fail').css('display','block');
        $('.results').css('display','none');
        $("#loader").delay(500).fadeOut();
        alert(response.error);
      }
      else if(response.movie.results.length<1){
        $('.fail').css('display','block');
        $('.results').css('display','none');
        $("#loader").delay(500).fadeOut();
      }
      else{
        $("#loader").css('display', 'flex').hide().fadeIn();
        $('.fail').css('display','none');
        var movie_id = response.movie.results[0].id;
        var movie_title = response.movie.results[0].original_title;
        movie_recs(movie_title,movie_id);
      }
    },
    error: function(){
      alert('Invalid Request');
      $("#loader").delay(500).fadeOut();
    },
  });
}

// passing the movie name to get the similar movies from python's flask
function movie_recs(movie_title,movie_id){
  $.ajax({
    type:'POST',
    url:"/similarity",
    data:{'name':movie_title},
    success: function(recs){
      if(recs=="Sorry! The movie you requested is not in our database. Please check the spelling or try with some other movies"){
        $('.fail').css('display','block');
        $('.results').css('display','none');
        $("#loader").delay(500).fadeOut();
      }
      else {
        $('.fail').css('display','none');
        var movie_arr = recs.split('---');
        var arr = [];
        for(const movie in movie_arr){
          arr.push(movie_arr[movie]);
        }
        get_movie_details(movie_id,arr,movie_title);
      }
    },
    error: function(){
      alert("error recs");
      $("#loader").delay(500).fadeOut();
    },
  }); 
}

// get all the details of the movie using the movie id.
function get_movie_details(movie_id,arr,movie_title) {
  $.ajax({
    type:'POST',
    url:'/get_movie_by_id',
    data: {'movie_id': movie_id},
    success: function(response){
      if(response.error){
        alert("API Error: " + response.error);
        $("#loader").delay(500).fadeOut();
      } else {
        show_details(response.movie_details,arr,movie_title,movie_id);
      }
    },
    error: function(){
      alert("API Error!");
      $("#loader").delay(500).fadeOut();
    },
  });
}

// passing all the details to python's flask for displaying and scraping the movie reviews using imdb id
function show_details(movie_details,arr,movie_title,movie_id){
  var imdb_id = movie_details.imdb_id;
  var poster = 'https://image.tmdb.org/t/p/original'+movie_details.poster_path;
  var overview = movie_details.overview;
  var genres = movie_details.genres;
  var rating = movie_details.vote_average;
  var vote_count = movie_details.vote_count;
  var release_date = new Date(movie_details.release_date);
  var runtime = parseInt(movie_details.runtime);
  var status = movie_details.status;
  var genre_list = []
  for (var genre in genres){
    genre_list.push(genres[genre].name);
  }
  var my_genre = genre_list.join(", ");
  if(runtime%60==0){
    runtime = Math.floor(runtime/60)+" hour(s)"
  }
  else {
    runtime = Math.floor(runtime/60)+" hour(s) "+(runtime%60)+" min(s)"
  }
  arr_poster = get_movie_posters(arr);
  
  movie_cast = get_movie_cast(movie_id);
  
  ind_cast = get_individual_cast(movie_cast);
  
  details = {
    'title':movie_title,
      'cast_ids':JSON.stringify(movie_cast.cast_ids),
      'cast_names':JSON.stringify(movie_cast.cast_names),
      'cast_chars':JSON.stringify(movie_cast.cast_chars),
      'cast_profiles':JSON.stringify(movie_cast.cast_profiles),
      'cast_bdays':JSON.stringify(ind_cast.cast_bdays),
      'cast_bios':JSON.stringify(ind_cast.cast_bios),
      'cast_places':JSON.stringify(ind_cast.cast_places),
      'imdb_id':imdb_id,
      'poster':poster,
      'genres':my_genre,
      'overview':overview,
      'rating':rating,
      'vote_count':vote_count.toLocaleString(),
      'release_date':release_date.toDateString().split(' ').slice(1).join(' '),
      'runtime':runtime,
      'status':status,
      'rec_movies':JSON.stringify(arr),
      'rec_posters':JSON.stringify(arr_poster),
  }

  $.ajax({
    type:'POST',
    data:details,
    url:"/recommend",
    dataType: 'html',
    complete: function(){
      $("#loader").delay(300).fadeOut();
    },
    success: function(response) {
      $('.results').html(response);
      $('#autoComplete').val('');
      
      // Show modal instead of scrolling
      $('#movieModal').fadeIn(400);
      
      // Add modal close functionality
      $('.modal-close').off('click').on('click', function() {
        $('#movieModal').fadeOut(300);
        $(document).off('keydown.modal');
      });
      
      // Close modal when clicking outside
      $('#movieModal').off('click').on('click', function(e) {
        if (e.target === this) {
          $('#movieModal').fadeOut(300);
          $(document).off('keydown.modal');
        }
      });
      
      // Close modal with escape key
      $(document).off('keydown.modal').on('keydown.modal', function(e) {
        if (e.keyCode === 27) {
          // Check if any Bootstrap modal is open
          if ($('.modal.show').length === 0) {
            $('#movieModal').fadeOut(300);
            $(document).off('keydown.modal');
          }
        }
      });
      
      // Handle Bootstrap modals properly - COMPLETELY separate from our movie modal
      $(document).off('show.bs.modal hidden.bs.modal'); // Clear any existing handlers
      
      $(document).on('show.bs.modal', '.modal', function() {
        // Move movie modal behind Bootstrap modal
        $('#movieModal').addClass('modal-behind');
        // Stop our modal event handlers while Bootstrap modal is open
        $(document).off('keydown.modal');
      });
      
      $(document).on('hidden.bs.modal', '.modal', function() {
        // Restore movie modal z-index
        $('#movieModal').removeClass('modal-behind');
        // Restore our modal event handlers
        $(document).off('keydown.modal').on('keydown.modal', function(e) {
          if (e.keyCode === 27 && $('.modal.show').length === 0) {
            $('#movieModal').fadeOut(300);
            $(document).off('keydown.modal');
          }
        });
      });
      
      // CRITICAL: Ensure Bootstrap modal events are not blocked
      // Remove any event prevention that might block Bootstrap functionality
      $('.modal').off('click.prevent');
      
      // Force Bootstrap modal close functionality
      $(document).on('click', '.modal .close[data-dismiss="modal"]', function(e) {
        e.stopPropagation();
        $(this).closest('.modal').modal('hide');
      });
      
      // Allow clicking outside Bootstrap modal to close it
      $(document).on('click', '.modal', function(e) {
        if (e.target === this) {
          $(this).modal('hide');
        }
      });
      
      // The onclick="recommendcard(this)" in the template should handle clicks
      // Just ensure the function is available globally
      window.recommendcard = recommendcard;
    }
  });
}

// get the details of individual cast - back to synchronous for reliability
function get_individual_cast(movie_cast) {
    cast_bdays = [];
    cast_bios = [];
    cast_places = [];
    for(var cast_id in movie_cast.cast_ids){
      $.ajax({
        type:'POST',
        url:'/get_cast_details',
        data: {'cast_id': movie_cast.cast_ids[cast_id]},
        async:false, // Keep synchronous to ensure data integrity
        success: function(response){
          if(response.error){
            cast_bdays.push('Unknown');
            cast_bios.push('Biography not available');
            cast_places.push('Unknown');
          } else {
            var cast_details = response.cast_details;
            cast_bdays.push(cast_details.birthday ? (new Date(cast_details.birthday)).toDateString().split(' ').slice(1).join(' ') : 'Unknown');
            cast_bios.push(cast_details.biography || 'Biography not available');
            cast_places.push(cast_details.place_of_birth || 'Unknown');
          }
        },
        error: function(){
          cast_bdays.push('Unknown');
          cast_bios.push('Biography not available');
          cast_places.push('Unknown');
        }
      });
    }
    return {cast_bdays:cast_bdays,cast_bios:cast_bios,cast_places:cast_places};
  }

// getting the details of the cast for the requested movie
function get_movie_cast(movie_id){
    cast_ids= [];
    cast_names = [];
    cast_chars = [];
    cast_profiles = [];

    $.ajax({
      type:'POST',
      url:'/get_movie_cast',
      data: {'movie_id': movie_id},
      async:false,
      success: function(response){
        if(response.error){
          alert("Invalid Request: " + response.error);
          $("#loader").delay(500).fadeOut();
          return;
        }
        var my_movie = response.cast_data;
        var top_cast;
        if(my_movie.cast.length>=10){
          top_cast = [0,1,2,3,4,5,6,7,8,9];
        }
        else {
          top_cast = [0,1,2,3,4];
        }
        for(var my_cast in top_cast){
          if(my_movie.cast[my_cast]){
            cast_ids.push(my_movie.cast[my_cast].id)
            cast_names.push(my_movie.cast[my_cast].name);
            cast_chars.push(my_movie.cast[my_cast].character);
            cast_profiles.push("https://image.tmdb.org/t/p/original"+my_movie.cast[my_cast].profile_path);
          }
        }
      },
      error: function(){
        alert("Invalid Request!");
        $("#loader").delay(500).fadeOut();
      }
    });

    return {cast_ids:cast_ids,cast_names:cast_names,cast_chars:cast_chars,cast_profiles:cast_profiles};
  }

// getting posters for all the recommended movies - back to synchronous for reliability
function get_movie_posters(arr){
  var arr_poster_list = []
  for(var m in arr) {
    $.ajax({
      type:'POST',
      url:'/get_movie_poster',
      data: {'title': arr[m]},
      async: false, // Make it synchronous to ensure data is ready
      success: function(response){
        if(response.error){
          arr_poster_list.push('/static/image.jpg'); // fallback image
        } else {
          arr_poster_list.push('https://image.tmdb.org/t/p/w500'+response.poster_path); // Use w500 for faster loading
        }
      },
      error: function(){
        arr_poster_list.push('/static/image.jpg'); // fallback image
      },
    })
  }
  return arr_poster_list;
}
