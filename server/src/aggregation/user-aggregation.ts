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
export const addNotifications = {
    $lookup: {
        localField: "uid",
        foreignField: "receiver",
        as: "notifications",
        from: "notifications",
        pipeline: [
            {
                $match: {
                    "$expr": {
                        $eq: ["$has_read", false]
                    } 
                }
            }
        ]
    }
}

export const addBagesCount = {
    $addFields: {
        badges: {
            date_requests_count: { $size: "$date_requests" },
            notifications_count: { $size: "$notifications" }
        }
    }
}

export const addBagesCond = {
    $addFields: {
        badges: {
            has_date_requests: { 
                $gt: [ "$badges.date_requests_count", 0 ] 
            },
            has_notifications: {
                $gt: [ "$badges.notifications_count", 0 ] 
            }
        }
    }
}

const projection = {
    $project: {
        date_requests: 0,
        notifications: 0,
    }
}

export const currentUserAggregation = (uid: string) => [ { $match: { uid } } ,addDateRequest, addNotifications, addBagesCount, addBagesCond, projection]

//Math.floor(moment.duration(now.diff(moment("$birthday"))).asYears())