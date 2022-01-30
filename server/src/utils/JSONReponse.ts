import { Request, Response } from "express"
class JSONRESPONSE {
    constructor(private res: Response){};
    public success(msg: string = "success", data: any = {}){
        this.res.status(200).send({success: true, msg, data, redirect: false})
    }
    public serverError(){
        this.res.status(200).send({success: false, msg: "Something went wrong :(", data: {}, redirect: null})
    }
    public notFound(msg: string = "not found"){
        this.res.status(200).send({success: false, msg, data: {}, redirect: false})
    }
    public notAuthorized(msg: string = "you are not authorized"){
        this.res.status(200).send({success: false, msg, data: {}, redirect: true, redirect_url: "/login"})
    }
    public clientError(msg: string){
        this.res.status(200).send({success: false, msg, data: {}, redirect: null})
    }
}
export default JSONRESPONSE
