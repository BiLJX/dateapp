import moment from "moment"
const now = moment(new Date());
export const addDateRequest = {
    $lookup: {
        localField: "uid",
        foreignField: "request_sent_to",
        as: "date_requests",
        from: "daterequests"
    }
}

export const addBagesCount = {
    $addFields: {
        badges: {
            date_requests_count: { $size: "$date_requests" },
        }
    }
}

export const addBagesCond = {
    $addFields: {
        badges: {
            has_date_requests: { 
                $gt: [ "$badges.date_requests_count", 0 ] 
            }
        }
    }
}

export const currentUserAggregation = (uid: string) => [ { $match: { uid } } ,addDateRequest, addBagesCount, addBagesCond]

//Math.floor(moment.duration(now.diff(moment("$birthday"))).asYears())