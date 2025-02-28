# TestCommTinderAPI
## authRouter
- POST /signup
- POST /login
- POST /logout
## profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password
## connectionRequestRouter
- POST /request/send/interested/:toUserId
- POST /request/send/ignored/:toUserId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId
## userRouter
- GET user/request/received/accepted - get all connections made - (status Accepted)
- GET user/request/ignored - get all user rejected - (status Ignored)
- GET user/request/sent - all requests sent by sender - (status Interested)
- GET user/request/received/rejected - all requests received - (status Rejected)
- GET user/feeds - gets all users


Status: Interested, Ignored (Sender)
        Accepted, Rejected (Receiver reviews)