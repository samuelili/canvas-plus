var $customs = $('#customs');

function addCustom(id, course) {
  console.log('Setting up course with id ' + id, course);
  var $label = $('<div><h6>' + course.name + '</h6></div>');
  var $input = $('<input type="text" placeholder="http://..."/>').val(course.custom);
  $label.append($input);
  $customs.append($label);

  $input.on('input', function() {
    var updated = {};
    updated[id] = {
      name: course.name,
      custom: $input.val()
    }
    chrome.storage.sync.set(updated, function() {
      console.log('Updated value', updated);
    });
  })
}

chrome.storage.sync.get({
  courseIds: []
}, function(items) {
  var courseIds = items.courseIds;
  console.log("Got courseIds", courseIds);

  var request = {};
  for (var id of courseIds)
    request[id] = {
      "name" : "",
      "custom": ""
    }

  chrome.storage.sync.get(request, function(items) {
    console.log(items);
    for (var key in items) {
      addCustom(key, items[key]);
    }
  })
})