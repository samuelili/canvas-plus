# better-canvas

chromium extension that enchances the canvas experience

## Running
Run `yarn watch` to start webpack. Open the extension under the `extension` folder in this project. Tdochat's where project files are outputted.

### State Schema

```json
{
  "<canvasPageHostname>": <Instance>
}
```

#### Instance Schema

```json
{
  "courses": {
    "<courseId>": <Course>
  },
  "courseIds": [],
  "hiddenCourseIds": [],
  "hiddenAssignments": [],
  "settings": {
    "tabsEnabled": true,
    "gradesEnabled": true,
    "upcomingAssignmentsEnabled": true,
    "gradeTagsEnabled": true
  }
}
```

#### Course Schema

```json
{
  "customLinks": {
    "<customLinkName>": <string>
  },
  "displayName": <string>,
  "id": <string>,
  "name": <string>,
}
```