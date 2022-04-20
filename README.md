# better-canvas

chromium extension that enchances the canvas experience

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