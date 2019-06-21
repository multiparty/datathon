
$(function() {
  $(document).on('change', ':file', function() {
    var input = $(this),
        files = input.get(0).files

    var fileNames = [];
    for (var f of files) {
      fileNames.push(f.name);
    }

    for (var i = 0; i < fileNames.length; i++) {

      var tableBody = document.getElementById('tableBody');

      var tr = document.createElement('tr');
      var numCell = document.createElement('td');
      numCell.innerText = i;
      var nameCell = document.createElement('td');
      nameCell.innerText = fileNames[i];

      var iconCell = document.createElement('td');
      var icon = document.createElement('img');
      icon.setAttribute('src', 'images/file_icon.png');
      icon.setAttribute('class', 'fileIcon');

      iconCell.append(icon);

      tr.append(numCell);
      tr.append(nameCell);
      tr.append(iconCell);
      tableBody.append(tr);
    
    }
  });
});


