# Labo01: Mining data in GitHub

##Purpose of the application
This application will show you a graphic with the commit over time of a repository that you have specified. The Y-Axe is the number of commit in one date and the X-Axe is the dates. I only display the date with a commit because date without commit are note really interessting.

##Technology used
- [GitHub Pages](https://pages.github.com/) for the landing page.
- [Heroku](https://www.heroku.com/) app to get my application on the Web.
- [Angular-JS](https://angularjs.org/) for the front-end.
- [NodeJS](https://nodejs.org/) for the backend.
- [Chart.js](http://www.chartjs.org/) for the graphic.
- [Request-Promise](https://www.npmjs.com/package/request-promise) for the request on the back-end.
- [$http](https://docs.angularjs.org/api/ng/service/$http) (from Angular-JS) for the request on the front-end.
- [Jekyll](https://jekyllrb.com/) only for testing mechanics.
- [UI-Router](https://ui-router.github.io/docs/0.3.1/#/api/ui.router) for the routing service.

##Getting started
1. For using the application, simply go on the [Landing page](https://lepouletsuisse.github.io/github-explorer/) and click on the "Go to the App" green button on the top of the page.
2. When you are in the application, you can navigate on the second page (Page 2) with the top right menu icon.
3. Once you are in the application, you have different options:
	- Specify a owner and a repository to query on github.
	- Click on one of the link that is display (If queries has already be done only) to show a old query.
	- Delete all the precedent queries in the API (If you want to update them for exemple)

##Description
###Preamble
First of all, i'll explain the application part and not the Landing Pages because i only followed the well explained [tutorial on GitHub Pages](https://pages.github.com/) and used the base template of jekyll for this part.
So i'll explain the logic in the Page2 folder of my app and my API (Back-end).
###Front-End
#####HTML
The HTML part is using a simple HTML template [Spectral](https://html5up.net/spectral).
#####Controller
The controller will manage the HTML view by setting the variable of the view and manage to call the appropriate service to get the correct information asked by the user.
#####Service
The Page2Service will do the link between my front-end and back-end by sending the request asked by the user to the back-end and get the response to send it again to the controller.
#####Route
Everything after "/#!/" URI is redirect on Page1, Page2 or Page3 if the URL is correct or Page1 otherwise.

###Back-end
#####API - Explication
My API is quite simple and has only 1 endpoint with 3 different type of request on it. I choosed this method instead of having different endpoint because the logic of the app allowed me to do it like this. I only needed to POST an owner/repo on the server to get the information back, GET all the old queries and DELETE all the old queries. We can easily imagine other endpoints if we want to do a user system or to give the possibility to manage query.

#####API - Endpoint
Here it is a table about my API. The URI for my API is {baseURI}/api and only accept 3 type of CRUD operations:

|Endpoint|Description|Parameters|
|:---:|:---:|:---:|
|GET /api|Get all the old queries store in the DB|-|
|POST /api|Get the data for the combinaison owner/repo gave in the parameter|`?owner=<theOwner>&repo=<theRepo>`|
|DELETE /api|Delete the collection of old queries|-|
