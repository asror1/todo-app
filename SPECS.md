# Project Requirements - TODO Application

## 1. Introduction

This *personal* project is meant to be a **realization** of theoretical concepts such as _UI/UX methodologies_ as well as _algorithms_ and _data structures_. It is meant to demonstrate the synergy between the above concepts and their importance in **practice** rather than  theory. In order to properly demonstrate the purpose statement, the application should not mention the implementation details, rather it should act as a showcase for the concepts in action, while this specification will provide some clarification.

### 1.1 UI/UX Methodologies

#### Accessibility

Accessibility in the context of software development is a design and development approach that emphasizes the creation of digital solutions with the broadest possible user-base. It advocates for the design and development of digital products that are not only usable by individuals with disabilities, but also cater to a wider audience including, but not limited to, mobile device users and individuals with limited network connectivity.

The importance of ensuring that software is accessible to ALL users cannot be understated. As a developer it is easy to develop for "me", however it is extremely detrimental not only to the product, but also morally. This specification will not delve deep into moral dilemmas, but one thing must be said - good software should not isolate the end user.

With the progression of HTML and CSS toward being more accessible natively, it is easier than ever to make the necessary changes to make sure a web application is properly accessible.

Below is a table of different impairments and ways to accommodate
| Impairment | Accommodation |
| :---: | :---: |
| Visual | Minimizing visual ques for important actions. <br> Develop for screen readers |
| Auditory | Provide subtitles for any auditory output |
| Physical | Allow keyboard and touch screen access for all actions |
| Cognitive / Learning / Neurological | Accompany text with easily recognizable symbols. <br> Provide a means to remove/reduce movement on the screen.|

#### Shneiderman's 8 Golden Rules

Ben Shneiderman who is a distinguished computer scientist and professor at the University of Maryland Human-Computer Interaction Lab, proposed the "Eight Golden Rules of Interface Design" in his book "Designing the User Interface: Strategies for Effective Human-Computer Interaction", first published in 1986.

The following is a brief rundown on Shneiderman's 8 golden rules, as well as the importance of each rule when it comes to ensuring user satisfaction, and improving user experience.

1. **Strive for Consistency** - Using familiar call-to-actions, icons, colors, user flows.. Ultimately decreasing the user's cognitive load.

2. **Seek universal usability** - Catering to a diverse range of users, making it easy to change or adapt content to suit different needs. Improves overall quality of user experience.

3. **Offer Informative Feedback** - Providing appropriate feedback for every user action. Enhances user engagement.

4. **Design Dialog to Yield Closure** - Having clear beginnings, middles and ends in the application. Provides users with a sense of accomplishment.

5. **Prevent Errors** - Having constraints and clear recovery instructions after errors. Enhances user confidence and increases user satisfaction by reducing frustration and confusion.

6. **Permit Easy Reversal of Actions** - Allowing users to easily undo their actions. Encourages the user to explore more of the application.

7. **Keep Users in Control** - Ensuring that the interface responds predictably to user actions. Decreases user confusion.

8. **Reduce Short-term Memory Load** - Minimizing the amount of information the user needs to remember between different parts of the interface. Accommodates the limitations of human short-term memory, making the application easier to use.

### 1.2 Algorithms

An algorithm could be defined as a step-by-step procedure to solve a problem or complete a task. While their definition might be simple, they are an incredible powerful tool that is used in all aspects of software engineering. Sometimes due to various levels of abstraction, algorithms are hidden away, but they are crucial for maintaining and running the global software infrastructure.

Table to demonstrate some of the real world use cases of algorithms
| Algorithm | Use case |
| :---: | :---: |
| Binary Search | Used in searching databases |
| Breadth-First and Depth-First Searches | Network broadcasting |
| Sorting Algorithms | Resource scheduling |
| Dijkstra's Shortest Path Algorithm | GPS navigation systems |
| Bellman Ford Algorithm | Routing protocols in networks |
| Kadane's Algorithm | Image processing |

### 1.3 Data Structures

Data structures is yet another aspect of software engineering that sometimes doesn't get enough credit due to having been abstracted. However data structures are the fundamental building blocks of software. Being able to store data, and store it efficiently, makes developing software possible. 

The fundamental building block of a lot software is some sort of a data structure, but the fundamental building block of a lot of data structures is an array. And even though an array has some down sides, without its random access capability, many more complex data structures would not be able to exist... Hash tables or dictionaries being one of them.

Hash tables are an extremely versatile and valuable data structure. Their use cases range from caching, to indexing in a search engine.

There are also sequential data structures that do not require random access capabilities, but are as popular if not more popular. Some examples of sequential data structures include: 
* Stacks
* Queues
* Linked Lists
* Trees
* Graphs

While on the topic of data structures, and considering the fact that this specification is quite unorthodox since it is meant to be a specification for 1 person (me), I feel like it is acceptable for me to mention that my personal favorite data structure has to be Red-Black Binary search trees. I find the method with which a Red-Black tree ensures a balanced structure of nodes, quite interesting. 

## 2. Glossary

- **Task**: A future action or event. Could be near future
- **Item**: A task
- **List**: Collection of tasks
- **Active**: Status of a task, indicating that is has not been completed
- **Priority**: Level of importance assigned to a task
- **State**: Task meta-data, such as task description/title, priority, and whether it is completed
- **Element**: Refers to some HTML element

## 3. Domain

The application operates in the domain of task management. This domain involves the organization, tracking, and completion of tasks, which can range from personal errands to professional projects. Here are some key aspects:

### 3.1 Functional Requirements

- _Task Creation_: Users should be able to create new tasks, specifying details such as task name/description, and priority level.
- _Task Viewing_: Users should be able to view their tasks in various ways, such as by, priority, or sort by task name/description.
- _Task Updating_: Users should be able to update task status. Mark a task as complete, or re-do a task.
- _Task Deletion_: Users should be able to delete tasks that are no longer needed.

### 3.2 Non-Functional Requirements

- _Usability_: The application must follow Shneiderman 8 Golden Rules, as well as accessibility methodology, with an intuitive interface that makes it easy for users to manage their tasks.
- _Performance_: The application should respond quickly to user actions, even when managing a large number of tasks.
- _Reliability_: The application should reliably store user data, ensuring that no tasks are lost or corrupted.

## 4. Constraints

This section outlines the constraints that have been imposed on the implementation of the app.

### 4.1 Dependency Minimization

The TODO application is designed to minimize dependencies on third-party libraries. This constraint is imposed to ensure a relatively small bundle size, which is crucial for efficient deployment and operation. 

### 4.2 Prioritization of Native Implementation

In line with the constraint on dependency minimization, there is a strong emphasis on prioritizing the implementation of any missing functionality within the application itself. This approach ensures that the application remains lightweight and efficient, while also providing an opportunity for the underlying purpose to be implemented in full effect, without the assistance of external libraries.

## 5. Dependencies

The TODO app is built using web technologies and relies on the following dependencies:

1. **HTML** - The application uses the latest version of HTML for structuring the web content. It is assumed that the user’s browser supports the latest HTML standards. [HTML Living Standard](https://html.spec.whatwg.org/multipage/)

2. **CSS** - The latest version of CSS is used for styling the application. The user’s browser should support the latest CSS properties to ensure the application is displayed as intended. [W3C's CSS Snapshot](https://www.w3.org/Style/CSS/Overview.en.html)

3. **JavaScript (ES6)** - The application uses ES6 JavaScript for dynamic functionality. This includes the use of the DOM API for manipulating HTML and CSS and Web Storage API for client side storage of data. The user’s browser must support ES6 syntax and features. [ECMA-262](https://ecma-international.org/publications-and-standards/standards/ecma-262/)
