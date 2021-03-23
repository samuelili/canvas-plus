var $customs = $('#customs');

chrome.runtime.sendMessage({
  action: 'GET'
}, state => {
  console.log('Got state', state);
  let tabs = document.querySelector('.tabs');
  if (state.instances.length === 0) return;

  let currentInstance = state[state.instances[0]];
  let currentInstanceIndex = 0;

  //   courseIds: [],
  // tabsEnabled: true,
  // gradesEnabled: true,
  // gradeTagsEnabled: true
  console.log(currentInstance);

  // add tabs
  for (let i = 0; i < state.instances.length; i++) {
    let instance = state.instances[i];
    const tab = document.createElement('li');
    tab.className = 'tab col s3';
    tab.innerHTML = `<a href="#${instance}">${instance}</a>`;

    tab.addEventListener('click', () => {
      currentInstance = state[instance];
      currentInstanceIndex = i;
      initialize();
    })
    tabs.append(tab);
  }
  tabs = M.Tabs.init(document.querySelector('.tabs'), {});


  var $grades = $('#grades')
  var $gradeTags = $('#grade-tags')

  function initialize() {
    $grades.attr("checked", currentInstance.settings.gradesEnabled);
    $gradeTags.attr("checked", currentInstance.settings.gradeTagsEnabled);

    initializeTabs();
    initializeCustomLinks();
  }

  /*
  ===========================
  Tabs
  ===========================
   */
  var $tabs = $('#tabs');
  var $orderTabs = $('#order-tabs');

  function initializeTabs() {
    $tabs.attr("checked", currentInstance.settings.tabsEnabled);

    function populateOrder() {
      $orderTabs.html(""); // clear html
      currentInstance.courseIds.forEach((courseId, i) => {
        let $course = $(`<div class="order-course">
                    <div>
                        <i class="up material-icons">arrow_drop_up</i>
                        <i class="down material-icons">arrow_drop_down</i>
                    </div>
                    <div class="text">${currentInstance.courses[courseId].name}</div></div>`)
        $orderTabs.append($course);

        $up = $course.find('.up');
        $down = $course.find('.down');
        if (i !== 0)
          $up.on('click', () => {
            currentInstance.courseIds.splice(i, 1);
            currentInstance.courseIds.splice(i - 1, 0, courseId);
            populateOrder();
          })
        if (i !== currentInstance.courseIds.length - 1)
          $down.on('click', () => {
            currentInstance.courseIds.splice(i, 1);
            currentInstance.courseIds.splice(i + 1, 0, courseId);
            populateOrder();
          })
      });
    }

    populateOrder();
  }

  // listeners
  $tabs.on('input', function () {
    currentInstance.settings.tabsEnabled = $tabs.is(":checked");
    console.log('Updated value', $tabs.is(":checked"));
  })

  /*
  ===========================
  Dashboard
  ===========================
   */
  $grades.on('input', function () {
    currentInstance.settings.gradesEnabled = $grades.is(":checked");
    console.log('Updated value', $grades.is(":checked"));
  })

  $gradeTags.on('input', function () {
    currentInstance.settings.gradeTagsEnabled = $gradeTags.is(":checked");
    console.log('Updated value', $grades.is(":checked"));
  });

  $('#update-button').on('click', () => {
    state[state.instances[currentInstanceIndex]] = currentInstance;
    chrome.runtime.sendMessage({
      action: 'SET',
      state: state
    }, () => {
      console.log('Successfully Updated');
    })
  });

  /*
  ===========================
  Custom Links
  ===========================
   */
  function initializeCustomLinks() {
    $customs.html(""); // clear html
    for (let courseId of currentInstance.courseIds) {
      let id = courseId;
      let course = currentInstance.courses[courseId];
      console.log('Setting up course with id ' + id, course);
      let $label = $('<div><h6>' + course.name + '</h6></div>');
      let $input = $('<input type="text" placeholder="http://..."/>').val(course.custom);
      $label.append($input);
      $customs.append($label);

      $input.on('input', function () {
        currentInstance.courses[courseId].custom = $input.val();
        console.log(currentInstance.courses[courseId].custom);
      })
    }
  }

  initialize();
})

// chrome.storage.sync.get({
// })