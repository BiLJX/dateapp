import { Request, Response } from "express"
class JSONRESPONSE {
    constructor(private res: Response){};
    public success(msg: string = "success", data: any = {}){
        this.res.status(200).send({success: true, msg, data, redirect: null})
    }
    public serverError(){
        this.res.status(500).send({success: false, msg: "Something went wrong :(", data: {}, redirect: null})
    }
    public notFound(msg: string = "not found"){
        this.res.status(404).send({success: false, msg, data: {}, redirect: null})
    }
    public notAuthorized(msg: string = "you are not authorized"){
        this.res.status(401).send({success: false, msg, data: {}, redirect: true, redirect_url: "/login"})
    }
    public clientError(msg: string){
        this.res.status(400).send({success: false, msg, data: {}, redirect: null})
    }
}
export default JSONRESPONSE
