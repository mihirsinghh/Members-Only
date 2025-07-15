# Members-Only
A message board where users can write anonymous posts. However, only members can see who the author of each post is.

Authentication flow works as follows:

    1. Passport is initialized - the authentication strategy is defined, as well as what user info to store in the session if necessary (serializeUser()), and how to extract the user info from the session and use it to access and set the full user object (deserializeUser()).
    2. User submits login info on form.
    3. Passport uses given strategy to validate login info.
    4. If validated, serializeUser() is called to store the user data in a new session object, which is stored under a session ID (sid) key. This key-value pair is sent back in a session cookie to the browser.
    5. The browser makes another request with that cookie, say, to view some content on the page.
    6. deserializeUser() is executed and the cookie attached to the request body is examined. The sid is used to access the session store, and if a session exists with user info in it, that user info is used to extract the full user object, likely from some other database. This user info is now set to the request body (req.user), and the request is processed.
    7. Once the request is completed, a response is set back to the browser. This response contains the same cookie, and steps 5-7 are repeated until the user logs out, which destroys the cookie contained in each request header, thereby ending the session.