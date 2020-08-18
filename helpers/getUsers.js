const password = "test";

const users = [
    {username: "Homer", password: password},
    {username: "Tom", password: password},
    {username: "Adam", password: password},
    {username: "Jen", password: password},
    {username: "Jacqueline", password: password},
    {username: "Andrew", password: password},
]
function createUsers() {
    let userObjs = [];
    User.deleteMany({},(err)=>{
        if (err){
            console.log(err);
        }
        else {
            users.forEach(user => {
                User.register(new User({username: user.username}), user.password, function(err, newUser){
                    if (err){
                        console.log(err);
                    }
                    else {
                        userObjs.push(newUser);
                    }
                });
            });  
            console.log(`userObj: ${userObjs}`);
            return userObjs;
        }
    });
}