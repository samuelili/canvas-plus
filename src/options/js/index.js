var $customs = $('#customs');

chrome.runtime.sendMessage({
  action: 'GET'
}, state => {
  console.log('Got state', state);
  let tabs = document.querySelector('.tabs');
  if (state.instances.length === 0) return;

  let currentInstance = state[state.instances[0]];

  //   courseIds: [],
  // tabsEnabled: true,
  // gradesEnabled: true,
  // gradeTagsEnabled: true
  console.log(currentInstance);

  var $tabs = $('#tabs');
  var $grades = $('#grades')
  var $gradeTags = $('#grade-tags')

  function populateTabs() {
    $tabs.attr("checked", currentInstance.settings.tabsEnabled);
    $grades.attr("checked", currentInstance.settings.gradesEnabled);
    $gradeTags.attr("checked", currentInstance.settings.gradeTagsEnabled);

    $customs.html(""); // clear html
    for (let courseId of currentInstance.courses) {
      let id = courseId;
      let course = currentInstance[courseId];
      console.log('Setting up course with id ' + id, course);
      let $label = $('<div><h6>' + course.name + '</h6></div>');
      let $input = $('<input type="text" placeholder="http://..."/>').val(course.custom);
      $label.append($input);
      $customs.append($label);

      $input.on('input', function () {
        currentInstance[courseId].custom = $input.val();
        console.log(currentInstance[courseId]);
      })
    }
  }

  // add tabs
  for (let instance of state.instances) {
    const tab = document.createElement('li');
    tab.className = 'tab col s3';
    tab.innerHTML = `<a href="#${instance}">${instance}</a>`;

    tab.addEventListener('click', () => {
      currentInstance = state[instance];
      populateTabs(state.instances.indexOf(instance));
    })
    tabs.append(tab);
  }
  tabs = M.Tabs.init(document.querySelector('.tabs'), {});

  $tabs.on('input', function () {
    currentInstance.settings.tabsEnabled = $tabs.is(":checked");
    console.log('Updated value', $tabs.is(":checked"));
  })

  $grades.on('input', function () {
    currentInstance.settings.gradesEnabled = $grades.is(":checked");
    console.log('Updated value', $grades.is(":checked"));
  })

  $gradeTags.on('input', function () {
    currentInstance.settings.gradeTagsEnabled = $gradeTags.is(":checked");
    console.log('Updated value', $grades.is(":checked"));
  });

  $('#update-button').on('click', () => {
    chrome.runtime.sendMessage({
      action: 'SET',
      state: state
    }, () => {
      console.log('Successfully Updated');
    })
  });

  populateTabs();
})

// chrome.storage.sync.get({
// })