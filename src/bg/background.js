import moment from "moment";

let DEFAULT_INSTANCE = {
    courses: {},
    courseIds: [],
    hiddenCourseIds: [],
    hiddenAssignments: [],
    settings: {
        tabsEnabled: true,
        gradesEnabled: true,
        upcomingAssignmentsEnabled: true,
        gradeTagsEnabled: true
    }
}

// we maintain local state here
// also default settings
let state = {};

// verify state integrity between different versions
function verifyStateIntegrity() {
    for (let instanceName of state.instances) {
        let instance = state[instanceName];
        for (let courseId of instance.courseIds) {
            let course = instance[courseId];
            if (!course.customLinks) {
                course.customLinks = {};
                if (course.customLink) {
                    course.customLinks["Custom Link"] = course.customLink;
                    delete course.customLink;
                }
            }
        }
    }
}

// resetting legacy settings for each instance goes here
function resetLegacyInstance(instance) {
    if (Array.isArray(state[instance].courses)) {
        state[instance].courses = {};
    }
}

chrome.storage.sync.get({
    instances: [],
}, items => {
    state.instances = items.instances;
    for (let instance of items.instances) {
        let request = {};
        request[instance] = DEFAULT_INSTANCE;
        chrome.storage.sync.get(request, items => {
            if (items[instance]) {
                state[instance] = {...DEFAULT_INSTANCE, ...items[instance]};
            }
            resetLegacyInstance(instance)
        });
    }

    verifyStateIntegrity();
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
    sendResponse(true);
}

// register an instance
function registerInstance(request, sender, sendResponse) {
    if (!Object.keys(state).includes(request.instance)) {
        state[request.instance] = DEFAULT_INSTANCE;

        state.instances.push(request.instance);
    }
    sendResponse(state[request.instance])

    sync(request.instance);
}

// update courses
function setCourses(request, sender, sendResponse) {
    let instance = state[request.instance];
    // sort raw courses into only data we care about to avoid bloat
    for (let course of request.courses) {
        // manage course info
        instance.courses[course.id] = {
            ...(instance.courses[course.id] || {
                customLinks: {},
                displayName: course.name,
            }),
            id: course.id,
            name: course.name
        }

        if (instance.courses[course.id].displayName === undefined)
            instance.courses[course.id].displayName = course.name;

        // manage ids
        if (!instance.courseIds.includes(course.id) && !instance.hiddenCourseIds.includes(course.id))
            instance.courseIds.push(course.id);
    }

    sync(request.instance);
    sendResponse(instance);

    // let instance = state[request.instance];
    // let newCourses = request.courses;
    //
    // for (let course of newCourses) {
    //   instance.courses[course.id] = {
    //     name: course.name,
    //     custom: "",
    //     id: course.id,
    //     ...(instance.courses[course.id] || {}) // if it doesn't exist, just use an empty object
    //   };
    //
    //   if (!instance.courseIds.includes(course.id) && !instance.hiddenCourseIds.includes(course.id)) {
    //     instance.courseIds.push(course.id);
    //   }
    // }
    // sendResponse(instance);
}

// get courses
function getCourses({instance}, sender, sendResponse) {
    sendResponse({
        courseIds: state[instance].courseIds,
        courses: state[instance].courses,
    });
    // let returnObj = {};
    // for (let course of state[instance].courses) {
    //   returnObj[course] = state[instance][course]
    // }
    // sendResponse(returnObj);
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

// set settings
function getTabs({instance}, sender, sendResponse) {
    // let courses = [];
    // state[instance].courses.forEach(courseId =>
    //     courses.push({
    //       ...state[instance][courseId],
    //       id: courseId
    //     }));
    sendResponse({
        courseIds: state[instance].courseIds,
        courses: state[instance].courses,
        // enabled: state[instance].settings.tabsEnabled
    })
}

function hideAssignment({instance, assignment}, sender, sendResponse) {
    state[instance].hiddenAssignments.push(assignment);

    state[instance].hiddenAssignments.filter(assignment => moment(assignment.dueDate) > moment());

    sync(instance);
    sendResponse(state[instance].hiddenAssignments);
}

window.reset = () => {
    state = {};
}

//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log('got action', request.action);
        switch (request.action) {
            case "RESET":
                reset();
                break;
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
            case "GET_TABS":
                getTabs(request, sender, sendResponse);
                break;
            case "HIDE_ASSIGNMENT":
                hideAssignment(request, sender, sendResponse)
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