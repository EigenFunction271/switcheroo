Schema Design Document
Since this is a frontend-only project, the “schema” here refers to component and state design.

App State:
js
Copy
Edit
isDay: boolean // true = day mode, false = night mode
Component Schema:
<ToggleSite /> (main page component)

State: isDay

Sub-elements:

Greeting text (Good Morning! or Good Night!)

Toggle switch:

Background gradient changes

Switch circle (sun/moon) slides and animates

Inline SVG changes depending on state