###What additional services would be needed to have a reliable and fast service? 
    - user availability would change by the second, the service that tells this one which users are available would need to be extremely fast and reliable
        - the user availability service might consider only responding to matchmaking request with a limited number of available candidates.  
        - this limited number could then be temporarility considered engaged until the match has been determined. 
        - this would increase the reliability of the service by not tying up the entire database while one user is seeking a match.
    - a user information service would need to take the lightweight responses from the user availability service and come back with the ratings of the relevant ones determined by this matchmaking service in a timely manner. 
###How would the services communicate with each other? 
    - services would ideally communicate via a cache that is constantly updated on the user's local browser, continuously swapping out available users every few seconds.
    - availability, user ratings, and matchmaking would be done before the user even clicks the button, so that the process is seemless an quick
###How would it scale? 
    - the more users presenrly logged in and matchmaking on the platform, the more minimum time would have to be alloted to each of their lobbies.
    - ideally, this would scale logrithmically, by taking the necessary service verification and validations steps even when there are fewer people online, the hardier this service would be.
    - or, different algorithms could be implemented depending on the traffic on the platform. 
###Which technologies are used? 
    - This could be done via AWS's load-balancing operatons, executing specific lambda functions with different levels of verification depending on that traffic. 
    - a database that integrates well with AWS's platform should be used, S3 could be used for storing all relevant data
    - the frontend could be handled by any modern standard: Angular, React, or Vue would all perform similarly if architected correctly 