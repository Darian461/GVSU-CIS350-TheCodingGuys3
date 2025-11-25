# The Coding Guys

# Team Members and Roles

* [Nikolai Escondo](https://github.com/nescondo/CIS350-HW2-Escondo)
* [Darian Radakovic](https://github.com/Darian461/CIS350-HW2-Radakovic)
* [Todd Parcheta](https://github.com/ToddPar/CIS350-HW2-Parcheta.git)
* [Dakota Steele](https://github.com/Jus1Dak/CIS350-HW2-Steele)

# Abstract

Health and fitness is a critical aspect in everyone's life. In today's technology driven era, a plethora of knowledge and accessibility to tools regarding our diet and exercise
are available to us through the internet. However, starting your health and fitness journey is a cumbersome task - especially when stonewalled by an overwhelming number
of applications and resources. On top of that, fitness applications meant for accessibility and ease-of-use are often bulky and filled with jargon and visual clutter that scare
away new users and beginners. Our goal is to create an application that remedies this issue - offering a fluid, easy-to-use, and accessible UI that is complete with the essential
functionalities of health and fitness applications such as food logging and data visualizations of dieting journey.

# Introduction

An intuitive, modern, easy-to-use all-in-one fitness web application that includes the ability to track calories, create recipes to log in our favorite foods, and data visualizations of the user's progress. We emphasize the intuitiveness and cleanliness of the UI - where we plan to design an interface that is clear of visual clutter and navigation is quick and easy to use. We plan to have processes that encompass the majority of what is used commonly in all calorie/macro tracking applications.

# Requirements
## Functional Requirements
<b>R1</b>: The user shall be presented with a landing page leading to a login prompt upon launching the application. <br>
<b>R2</b>: When the user clicks on the "Sign up" button, the user shall be routed to a registration page. <br>
<b>R3</b>: An account shall be created with a "Username", "Email", and "Password". <br>
<b>R4</b>: When the user clicks on the "Log in" button, the user shall be routed to the login page. <br>
<b>R5</b>: Upon an unsuccessful login, the user shall receive an "Alert" pop-up informing the user of "Invalid credentials". </br>
<b>R6</b>: Upon a successful account creation, the user shall receive an "Alert" pop-up informing the user, "Account created successfully. Please log in." </br>
<b>R7</b>: Upon a successful login, the user shall be navigated to the "Home" page of the application. </br>
<b>R8</b>: The user shall be navigated to the "Stats" page upon clicking the "Stats" button within the bottom navigation bar. </br>
<b>R9</b>: The user shall be navigated to the "Search Food" home page upon clicking the "+" button within the bottom navigation bar. </br>
<b>R10</b>: The user shall be navigated to the "History" page upon clicking the "History" button within the bottom navigation bar. </br>
<b>R11</b>: The user shall be navigated to the "Settings" page upon clicking the "Settings" button within the bottom navigation bar. </br>
<b>R12</b>: In the "Search Food" home page, when the user types in a valid food within the USDA Food Database, results of the food shall populate the table below the search field. </br>
<b>R13</b>: In the "Search Food" home page, when the user types in an invalid food within the USDA Food Database, "No results found" will be populated within the table below the search field. </br>
<b>R14</b>: In the "Search Food" home page, all food entries populated within the table shall be clickable by the user. </br>
<b>R15</b>: In the "Search Food" home page, when the user clicks on a food entry within the table, on successful load of a food entry, a pop-up of nutrition facts shall populate. </br>
<b>R16</b>: In the "Search Food" home page, when the user clicks on a food entry within the table, on unsuccessful load of a food entry, a pop-up notifying the user, "Failed to load nutrition information" will be displayed. </br>
<b>R17</b>: In the "Search Food" home page, when the user clicks on a food entry within the table, on successful load of a food entry, if no nutrition facts are available, a pop-up notifying the user, "No nutrition information available" will be displayed. </br>
<b>R18</b>: On successful add of a food entry, the user shall be presented with a "Success" message and the food will be added to the user profile's database history. </br>
<b>R19</b>: On unsuccessful add of a food entry, the user shall be presented with an error message stating, "Failed to add food to log". </br>
<b>R20</b>: On navigation to the "Search Food" home page, the user shall have the ability to click on the buttons for "Search Food" and "Create New Food" in the top navigation bar. </br>
<b>R21</b>: In the "Create New Food" page, the user shall be presented with a template to create a new food. </br>
<b>R22</b>: In the "Create New Food" page, the user shall be able to enter the food name, energy (calories), total fat, trans fat, and other macro/micronutrients of the food. </br>
<b>R23</b>: In the "Create New Food" page, when the user clicks on the "Add to Food Log" button, on successful add, the user shall be presented with a "Success" message and the food will be added to the user's profile's database history. </br>
<b>R24</b>: In the "Create New Food" page, when the user clicks on the "Add to Food Log" button, on unsuccessful add, the user shall be presented with an error message stating, "Failed to add food to log. Please try again." </br>
<b>R25</b>: In the "Stats" page, the user shall be presented with a daily visual breakdown of Fats, Protein, and Carbs. </br>
<b>R26</b>: In the "Stats" page, the user shall be presented with a daily nutrient breakdown of Calories, Fat, Tr. Fat, Sat. Fat, Carbs, and other macro/micronutrients </br>
<b>R27</b>: In the "History" page, the user shall be presented with the "Weight Progress" chart. </br>
<b>R28</b>: In the "History" page, the user shall be presented with the "Starting", "Current", and "Goal" weights table. </br>
<b>R29</b>: In the "History" page, the user shall be able to log a new weight upon clicking the "+ Log New Weight" button </br>
<b>R30</b>: In the "History" page, upon clicking the "Calories" tab, the user shall be presented with the "Calories History" chart. </br>
<b>R31</b>: In the "History" page, upon clicking the "Calories" tab, the user shall be presented with the "Daily Goal", "Average", "Lowest Day", and "Highest Day" calorie table. </br>
<b>R32</b>: In the "Settings" page, upon clicking the "Sign Out" button, the user shall be logged out of the account and navigated to the Login page. </br>

## Non-Functional Requirements
<b>NR1</b>: All user login information shall be encrypted in the PostgreSQL database. <br>
<b>NR2</b>: Passwords shall not be viewable at any point. <br>
<b>NR3</b>: In the "Sign up" screen, when a user completes "Username", "Email", and "Password" fields, the complete account button shall become functional. <br>
<b>NR4</b>: In the "Sign up" screen, when a user enters a unique "Username" and "Email", with a password field, the complete account process shall become functional. <br>
<b>NR5</b>: In the "Log in" screen, when a user completes the "Username or Email" and "Password" input fields, the login button shall become functional. <br>
<b>NR6</b>: Searching for a food shall call upon the USDA Food Database API and return the resulting food entries. <br>
<b>NR7</b>: Clicking on a specific food entry shall call upon the USDA Food Database API and return the resulting nutrition facts of said food entry. <br>
<b>NR8</b>: Adding food entries shall dynamically change the pie chart displaying the main calories or macronutrient selected on the "Home", and "Stats" screen. <br>
<b>NR9</b>: Removing food entries shall dynamically change the pie chart displaying the main calories or macronutrient selected on the "Home", and "Stats" screen. <br>
<b>NR10</b>: The header shall remain present on all pages of the application. <br>
<b>NR11</b>: All macro/micronutrients shall be rounded to the nearest hundredths place when being displayed in the UI. <br>
<b>NR12</b>: All measurements from the USDA Food Database returned with the unit, kJ (Kilojoules) shall be converted to calories. <br>
<b>NR13</b>: Calories, Carbs, Protein, and Fat shall be prioritized and sorted for each food entry. <br>
<b>NR14</b>: Searching for a food entry shall happen dynamically, allowing for incremental searching every 0.5 seconds. <br>
<b>NR15</b>: In the "Create New Food" screen, the "Food Name" entry shall be a required field. <br>
<b>NR16</b>: In the "Create New Food" screen, all nutrition fact entries shall be error validated for integers greater than zero. <br>

# Product Features
<ol>
    <li>The ability to track calories, macronutrients, and micronutrients on a day-to-day basis.</li>
    <li>Data visualization plots will be included to showcase progress in nutrition and weight on a daily, weekly, or monthly basis.</li>
    <li>Utilization of USDA FoodData Central database will be used to gather food nutrition data.</li>
    <li>The ability to create your own food through a generalized template.</li>
    <li>The ability to login and create new accounts with their own account history.</li>
</ol>

# Anticipated Technologies
<ol>
    <li>React Native</li>
        <ol>
            <li>Primary front-end development framework.</li>
        </ol>
    <li>TypeScript</li>
        <ol>
            <li>Primary front-end development programming language.</li>
        </ol>
    <li>Node.js</li>
        <ol>
            <li>Run-time environment to enable usage of JavaScript outside of web browsers.</li>
        </ol>
    <li>Python</li>
        <ol>
            <li>Primary back-end development programming language.</li>
        </ol>
    <li>Victory Native</li>
        <ol>
            <li>Component libraries for data visualization.</li>
        </ol>
    <li>gluestack-ui</li>
        <ol>
            <li>Component library for UI design.</li>
        </ol>
    <li>Lucide React Native</li>
        <ol>
            <li>Icon library for UI design.</li>
        </ol>
    <li>PostgreSQL</li>
        <ol>
            <li>Database management system.</li>
        </ol>
    <li>Figma</li>
        <ol>
            <li>Design tool for prototyping and UI/UX design.</li>
        </ol>
    <li>Jira</li>
        <ol>
            <li>Project management tool.</li>
        </ol>
</ol>
