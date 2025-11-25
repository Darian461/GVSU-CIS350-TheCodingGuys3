# Overview

This document is meant to store all of our functional and non-functional requirements for specific features within our application. 

# Functional Requirements

1. <b>Creation of Account</b> <br>
    <b>R1:</b> The user shall be presented with a landing page leading to a login prompt upon launching the application. <br>
	<b>R2:</b> When the user clicks on the "Sign up" button, the user shall be routed to a registration page. <br>
    <b>R3:</b> An account shall be created with a "Username", "Email", and "Password". <br>
    <b>R6:</b> Upon a successful account creation, the user shall receive an "Alert" pop-up informing the user, "Account created successfully. Please log in."

2. <b>Log into an Account</b> <br>
    <b>R1:</b> The user shall be presented with a landing page leading to a login prompt upon launching the application. <br>
    <b>R4:</b> When the user clicks on the "Log in" button, the user shall be routed to the login page. <br>
    <b>R5:</b> Upon an unsuccessful login, the user shall receive an "Alert" pop-up informing the user of "Invalid credentials" <br>
    <b>R6:</b> Upon a successful account creation, the user shall receive an "Alert" pop-up informing the user, "Account created successfully. Please log in." <br>
    <b>R7:</b> Upon a successful login, the user shall be navigated to the "Home" page of the application.

3. <b>Searching for Food</b> <br>
	<b>R9:</b> The user shall be navigated to the "Search Food" home page upon clicking the "+" button within the bottom navigation bar. <br>
	<b>R12:</b> In the "Search Food" home page, when the user types in a valid food within the USDA Food Database, results of the food shall populate the table below the search field. <br> 
	<b>R13:</b> In the "Search Food" home page, when the user types in an invalid food within the USDA Food Database, "No results found" will be populated within the table below the search field. <br>
    <b>R14:</b> In the "Search Food" home page, all food entries populated within the table shall be clickable by the user.

4. <b>Logging Food Entries</b> <br>
    <b>R14:</b> In the "Search Food" home page, all food entries populated within the table shall be clickable by the user.<br>
    <b>R15:</b> In the "Search Food" home page, when the user clicks on a food entry within the table, on successful load of a food entry, a pop-up of nutrition facts shall populate. <br>
    <b>R16:</b> In the "Search Food" home page, when the user clicks on a food entry within the table, on unsuccessful load of a food entry, a pop-up notifying the user, "Failed to load nutrition information" will be displayed. <br>
    <b>R17:</b> In the "Search Food" home page, when the user clicks on a food entry within the table, on successful load of a food entry, if no nutrition facts are available, a pop-up notifying the user, "No nutrition information available" will be displayed. <br>
    <b>R18:</b> On successful add of a food entry, the user shall be presented with a "Success" message and the food will be added to the user profile's database history. <br>
    <b>R19:</b> On unsuccessful add of a food entry, the user shall be presented with an error message stating, "Failed to add food to log".

5. <b>Creation of New Food</b> <br>
    <b>R20:</b> R20: On navigation to the "Search Food" home page, the user shall have the ability to click on the buttons for "Search Food" and "Create New Food" in the top navigation bar. <br>
	<b>R21:</b> In the "Create New Food" page, the user shall be presented with a template to create a new food. <br>
    <b>R22:</b> In the "Create New Food" page, the user shall be able to enter the food name, energy (calories), total fat, trans fat, and other macro/micronutrients of the food. <br>
    <b>R23:</b> In the "Create New Food" page, when the user clicks on the "Add to Food Log" button, on successful add, the user shall be presented with a "Success" message and the food will be added to the user's profile's database history. <br>
    <b>R25:</b> In the "Create New Food" page, when the user clicks on the "Add to Food Log" button, on unsuccessful



# Non-Functional Requirements

1. <b>Creation of Account</b><br>
	<b>NR1:</b> All user login information shall be encrypted in the PostgreSQL database.<br>
	<b>NR2:</b> Passwords shall not be viewable at any point.<br>
	<b>NR3:</b> In the "Sign up" screen, when a user completes "Username", "Email", and "Password" fields, the complete account button shall become functional.<br>
    <b>NR4:</b> In the "Sign up" screen, when a user enters a unique "Username" and "Email", with a password field, the complete account process shall become functional.

2. <b>Log into an Account</b><br>
    <b>NR1:</b> All user login information shall be encrypted in the PostgreSQL database.<br>
    <b>NR2:</b> Passwords shall not be viewable at any point.<br>
    <b>NR5:</b> In the "Log in" screen, when a user completes the "Username or Email" and "Password" input fields, the login button shall become functional.

3. <b>Searching for Food</b><br>
	<b>NR6:</b> Searching for a food shall call upon the USDA Food Database API and return the resulting food entries. <br>
    <b>NR14</b>: Searching for a food entry shall happen dynamically, allowing for incremental searching every 0.5 seconds.

4. <b>Logging Food Entries</b> <br>
    <b>NR8:</b> Adding food entries shall dynamically change the pie chart displaying the main calories or macronutrient selected on the "Home", and "Stats" screen. <br>
    <b>NR9:</b> Removing food entries shall dynamically change the pie chart displaying the main calories or macronutrient selected on the "Home", and "Stats" screen.

5. <b>Creation of New Food</b> <br>
    <b>NR12:</b> All measurements from the USDA Food Database returned with the unit, kJ (Kilojoules) shall be converted to calories. <br>
    <b>NR15:</b> In the "Create New Food" screen, the "Food Name" entry shall be a required field.Food Database API and return the resulting food entries.
    <b>NR16:</b> In the "Create New Food" screen, all nutrition fact entries shall be error validated for integers greater than zero.

