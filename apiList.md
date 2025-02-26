# TestCommTinderAPI
authRouter
- POST /signup
- POST /login
- POST /logout
profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password
connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId
userRouter
- GET user/connections - get all connections made
- GET user/request/sent - all requests sent by sender
- GET user/request/received - all requests received
- GET user/feeds - gets all users


Status: Interested, Ignored (Sender)
        Accepted, Rejected (Receiver reviews)