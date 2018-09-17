# WebDesigner
a web desginer based on html5/jquery pluggin/paper.js
With the continuous development of Internet technology and application, the application software has gradually developed from single-machine or client/server to browser Browser/Server. The author has been working on the development technology stack of Microsoft Department, and has been transforming from vb, C + + to c_ # WinForm to asp.net web development. In recent years, the technology of Web front-end has developed rapidly. Although many excellent web front-end application frameworks have emerged, the visual component designer technology often stays in the independent exe application based on client-side, or the web application based on client-side earlier, such as activeX/flex/Silverlight/WPF, etc. with the rapid development of HTML 5 technology. As a result, pure js, cross-platform component designs have been proposed that at runtime component visuals are compatible with different browser displays without installing any plug-ins (it's exciting to think I've been bothered by ActiveX's browser security, flex and silverlight's plug-ins installation). There are many third-party graphical JS libraries based on canvas and svg, such as Graphics JS, Raphaejs, Paper JS, glfx. JS, and so on. The paperjs library will be selected as the third-party graphics API library for this project to render pictures, text and animation in the browser.
Preliminary assumption that the final output of this project is only a JS file and CSS style file, initially named visual Designer. JS and visual Designer. css, and defined as a jQuery plug-in form, convenient for everyone to use.

User scenario:
I. design time (when administrator is implemented)
1. user initialization Designer (component drag, selection, component encapsulation, inheritance, etc.)
2. User Extension Components (Custom Components, for example, in the configuration design of Figure 2, the presentation and running state of the various components are different, and users can add them themselves)
3. User extensions set component states (such as standby, run, pause, shutdown, etc.)
4. Events of user-extended components (such as depending on input parameters to determine subsequent actions (or calling interfaces)
5. the user changes the subscription state of the component, such as the read interface of a component state of the configuration.
5. Preservation of user extensions (usually designed as callback functions, where users save callback designer layouts, elements, event settings, etc.)
II. Runtime
1. user initialization runtime Designer
2. the user loads the saved design file from the local and opens it.
3. users set the state of each component.
4. design update component state (refreshed periodically in periodic subscription)

In this source code, includes below concepts:
1. How to initialize a js plugin in html(refer to index.html)
2.JS component concept
3. mouse Drag/Drop event
4. component selection and move in design time
5.javascript OOP programming: encapsulation, inheritance
6. designer element management
7. wires (curve, broken line)
8. component size adjustment (to be continous)
9. component background picture (to be continous)
10. component runtime (to be continous)
