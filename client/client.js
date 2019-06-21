
$(function() {

  // We can attach the `fileselect` event to all file inputs on the page
  $(document).on('change', ':file', function() {
    var input = $(this),
        files = input.get(0).files

    var fileNames = [];
    for (var f of files) {
      fileNames.push(f.name);
    }

    console.log(fileNames);

    var inputLabel = $(this).parents('.input-group').find(':text');
    var nameString = fileNames.join('\n\n');
    console.log(nameString);

    inputLabel.val(fileNames.join('\n\n'));

        // label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    // input.trigger('fileselect', [files]);
  });

  // We can watch for our custom `fileselect` event like this
  $(document).ready( function() {
      // $(':file').on('fileselect', function(event, files) {


      //     var input = $(this).parents('.input-group').find(':text');
              // log = numFiles > 1 ? numFiles + ' files selected' : label;

          // if( input.length ) {
          //     input.val(log);
          // } else {
          //     if( log ) alert(log);
          // }
      // });
  });
});


