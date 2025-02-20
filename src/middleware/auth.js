
const adminAuth = (req,res,next)=>{
    console.log("Admin Auht is getting Checked")
    const token = "xyz"
    const isAuthorized = "xyz"
    if (isAuthorized===token){
        console.log("Admin Access Granted")
        next()
    }else{
        console.log("Admin Access Denied")
        res.status(401).send("Unauthorized Access")
    }
}
module.exports ={adminAuth}