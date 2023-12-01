import vueCookies from 'vue-cookies'
import axios from "axios"

function getAccessToken() {
	return vueCookies.get('accessToken')
}

function validateSession(router) {
	let access_token = vueCookies.get('accessToken')
	// validate access token

	if (access_token == null) {
    	router.push('/pages/login')
	}
}

function closeSession(router) {
	vueCookies.remove('accessToken')
	window.localStorage.clear()
	router.push('/pages/login')
}

export {getAccessToken, validateSession, closeSession}