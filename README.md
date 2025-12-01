# The Coding Guys

# Team Members and Roles

- [Nikolai Escondo](https://github.com/nescondo/CIS350-HW2-Escondo)
- [Darian Radakovic](https://github.com/Darian461/CIS350-HW2-Radakovic)
- [Todd Parcheta](https://github.com/ToddPar/CIS350-HW2-Parcheta.git)
- [Dakota Steele](https://github.com/Jus1Dak/CIS350-HW2-Steele)

# Abstract

Health and fitness is a critical aspect in everyone's life. In today's technology driven era, a plethora of knowledge and accessibility to tools regarding our diet and exercise
are available to us through the internet. However, starting your health and fitness journey is a cumbersome task - especially when stonewalled by an overwhelming number
of applications and resources. On top of that, fitness applications meant for accessibility and ease-of-use are often bulky and filled with jargon and visual clutter that scare
away new users and beginners. Our goal is to create an application that remedies this issue - offering a fluid, easy-to-use, and accessible UI that is complete with the essential
functionalities of health and fitness applications such as food logging and data visualizations of dieting journey.

# Introduction

An intuitive, modern, easy-to-use all-in-one fitness web application that includes the ability to track calories, create recipes to log in our favorite foods, and data visualizations of the user's progress. We emphasize the intuitiveness and cleanliness of the UI - where we plan to design an interface that is clear of visual clutter and navigation is quick and easy to use. We plan to have processes that encompass the majority of what is used commonly in all calorie/macro tracking applications.

# Product Features

<ol>
    <li>The ability to track calories, macronutrients, and micronutrients on a day-to-day basis.</li>
    <li>Data visualization plots will be included to showcase progress in nutrition and weight on a daily, weekly, or monthly basis.</li>
    <li>Utilization of USDA FoodData Central database will be used to gather food nutrition data.</li>
    <li>The ability to create your own food through a generalized template.</li>
    <li>The ability to login and create new accounts with their own account history.</li>
</ol>

# Technologies Used

<ol>
    <li><b>React Native</b></li>
        <ol>
            <li>Primary front-end development framework.</li>
        </ol>
        <li><b>Node.js</b></li>
        <ol>
            <li>Run-time environment to enable usage of JavaScript outside of web browsers.</li>
        </ol>
    <li><b>TypeScript</b></li>
        <ol>
            <li>Primary front-end development programming language.</li>
        </ol>
    <li><b>Python</b></li>
        <ol>
            <li>Primary back-end development programming language.</li>
        </ol>
    <li><b>Victory Native</b></li>
        <ol>
            <li>Component libraries for data visualization.</li>
        </ol>
    <li><b>gluestack-ui</b></li>
        <ol>
            <li>Component library for UI design.</li>
        </ol>
    <li><b>Lucide React Native</b></li>
        <ol>
            <li>Icon library for UI design.</li>
        </ol>
    <li><b>PostgreSQL</b></li>
        <ol>
            <li>Database management system.</li>
        </ol>
    <li><b>Docker</b></li>
        <ol>
            <li>Application containerization for standardized development environment.</li>
        </ol>
    <li><b>Figma</b></li>
        <ol>
            <li>Design tool for prototyping and UI/UX design.</li>
        </ol>
    <li><b>Jira</b></li>
        <ol>
            <li>Project management tool.</li>
        </ol>
</ol>

# Requirements

<ol>
 <li>Mobile device (Android or iOS preferred)</li>
 <li>Stable internet connection</li>
 <li>Email address (for account creation)</li>
</ol>

# Installation

<ol>
 <li>Install the latest version of <a href="https://nodejs.org/en/download/current">Node.js.</a></li>
 <li>Install the latest version of <a href="https://www.docker.com/">Docker Desktop.</a></li>
 <li>Clone our <a href="https://github.com/Darian461/GVSU-CIS350-TheCodingGuys3/tree/main">project</a> to your preferred location on your system.</li>
 <li>Open Docker Desktop.</li>
 <li>Install dependencies using the command: <b>npm install</b> in the main project directory (<b>your_project_path/GVSU-CIS350-TheCodingGuys3/TBD_CG3</b>).</li>
 <li>Change the 'API_BASE_URL' variable to your IP in the file: <b>your_project_path/GVSU-CIS350-TheCodingGuys3/TBD_CG3/app/config/apiConfig.ts</b>.</li>
 <li>Create your Docker environement using the command: <b>docker compose up</b> in the main project directory (<b>your_project_path/GVSU-CIS350-TheCodingGuys3/TBD_CG3</b>).</li>
 <li>Run the project using the command: <b>npx expo start</b>.</li>
 <li>Press <b>i</b> (iOS emulator) or <b>a</b> (Android emulator) on your keyboard when prompted (iOS preferred).</li>
</ol>
