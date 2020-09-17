let DEFAULT_INSTANCE = {
  courses: [],
  settings: {
    courseIds: [],
    tabsEnabled: true,
    gradesEnabled: true,
    gradeTagsEnabled: true
  }
}

// we maintain local state here
// also default settings
let state = {

};

chrome.storage.sync.get({
  instances: [],
}, items => {
  state.instances = items.instances;
  for (let instance of items.instances) {
    let request = {};
    request[instance] = DEFAULT_INSTANCE;
    chrome.storage.sync.get(request, items => {
      state[instance] = items[instance];
      console.log('got', items);
    });
  }
});


function sync(instance) {
  let request = {};
  request[instance] = state[instance];
  chrome.storage.sync.set(request, () => console.log('Updated sync', instance, state[instance]))
}

// get everything
function get(request, sender, sendResponse) {
  sendResponse(state);
}

// set everything
function set(request, sender, sendResponse) {
  state = request.state;
  console.log('Updated with state', request.state);
  chrome.storage.sync.set(state, () => console.log('Updated entire state'));
}

// register an instance
function registerInstance(request, sender, sendResponse) {
  if (!state.instances.includes(request.instance)) {
    state.instances.push(request.instance);
    state[request.instance] = {};
    chrome.storage.sync.set({instances: state.instances}, () => console.log('Updated sync instances', state.instances));
  } else {
    console.log(request.instance, 'already registered!');
  }
}

// update courses
function setCourses(request, sender, sendResponse) {
  let instance = request.instance;
  let courses = request.courses;
  for (let course of courses) { // make a new one, otherwise, don't override
    if (!Object.keys(state[instance]).includes(course.id)) {
      state[instance].courses.push(course.id);
      state[instance][course.id] = {
        name: course.name,
        custom: ""
      }
    }
  }

  sync(instance);
}

// get courses
function getCourses({instance}, sender, sendResponse) {
  let returnObj = {};
  for (let course of state[instance].courses)
    returnObj[course] = state[instance][course]

  sendResponse(returnObj);
}

// set settings
function setSetting({instance, key, value}, sender, sendResponse) {
  state[instance].settings[key] = value;
  sync(instance);
}

// get settings
function getSetting({instance, key}, sender, sendResponse) {
  sendResponse(state[instance].settings[key]);
}

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log('got action', request.action);
    switch (request.action) {
      case "GET":
        get(request, sender, sendResponse);
        break;
      case "SET":
        set(request, sender, sendResponse);
        break;
      case "REGISTER_INSTANCE":
        registerInstance(request, sender, sendResponse);
        break;
      case "SET_COURSES":
        setCourses(request, sender, sendResponse);
        break;
      case "GET_COURSES":
        getCourses(request, sender, sendResponse);
        break;
      case "SET_SETTING":
        setSetting(request, sender, sendResponse);
        break;
      case "GET_SETTING":
        getSetting(request, sender, sendResponse);
        break;
      case "OPTIONS":
        if (chrome.runtime.openOptionsPage) {
          chrome.runtime.openOptionsPage();
        } else {
          chrome.tabs.create({
            url: chrome.runtime.getURL('src/options/options.html')
          })
        }
        break;
    }
  });