import axios from "./instance"
enum PersonalityType {
    NONE,
    THE_INSPECTER,
    THE_COUNSELOR,
    THE_MASTERMIND,
    THE_GIVER,
    THE_CRAFTSMAN,
    THE_PROVIDER,
    THE_IDEALIST,
    THE_PERFORMER,
    THE_CHAMPION,
    THE_DOER,
    THE_SUPERVISOR,
    THE_COMMANDER,
    THE_THINKER,
    THE_NURTERER,
    THE_VISIONARY,
    THE_COMPOSER,
}
export interface PersonalityInterface {
    type: PersonalityType,
    name: string,
    description: string
}

export const personality_data: PersonalityInterface[] = [
    {
        type: PersonalityType.NONE,
        name: "None",
        description: ""
    },
    {
        type: PersonalityType.THE_INSPECTER,
        name: "The Inspector",
        description: "The ISTJ can be considered an intimidating personality type to approach, especially without a prior relationship. ISTJs appear serious, formal, and proper. This personality type places great importance on tradition and old-school values. Patience, hard work, honor and social and cultural responsibility are all cherished by the ISTJ. They are reserved, calm, quiet, and upright. These traits result from the combination of Introversion, Sensing, Thinking, and Judging. The result is a personality type that is often misunderstood."
    },
    {
        type: PersonalityType.THE_COUNSELOR,
        name: "The Counselor",
        description: "INFJs are visionaries and idealists. This personality type oozes creative imagination and brilliant ideas from every pore. They have a different, frequently profound, way of looking at the world that is not always understood. INFJs favor substance and depth in the way they think. This personality type will never accept anything at surface level or refuse to countenance a better way to approach problems. Others may perceive the INFJ as odd or amusing due to this variable outlook on life."
    },
    {
        type: PersonalityType.THE_MASTERMIND,
        name: "The Mastermind",
        description: "INTJs are true introverts. This personality type tends to be quiet, reserved and comfortable in their own company. INTJs are usually self-sufficient and prefer to work alone than in a group. Socializing significantly drains the energy of this personality type, causing them to need to recharge. Do not weight down an INTJ with small talk! They are more interested in big ideas and theories. When observing the world, INTJs regularly question why things happen the way they do. Uncertainty is the enemy of the INTJ. They excel at developing plans and strategies for every eventuality."
    },
    {
        type: PersonalityType.THE_GIVER,
        name: "The Inspector",
        description: "ENFJs are eternal people-pleasers. They are extroverted, idealistic, charismatic, outspoken, highly principled and ethical. This set of traits ensures that an ENFJ can usually connect with others of varying backgrounds and personalities. ENFJs rely more on intuition and feelings, living more in their imagination than the real world. This can be troublesome, for the individual themselves and those around them. Rather than living in the, “now” and what is currently happening, ENFJs tend to concentrate on the abstract and what could possibly unfold in the future."
    },
    {
        type: PersonalityType.THE_CRAFTSMAN,
        name: "The Craftsman",
        description: "ISTPs are mysterious and oft-misunderstood people. This personality type is typically defined by rationality and logic but is also capable of spontaneity and enthusiasm. The personality traits of the ISTP are tougher to recognize than those of other types. Even people who know the ISTP well cannot always anticipate their reactions. Deep down, ISTPs are spontaneous, unpredictable individuals, but they sometimes hide those traits from the outside world, favoring an approach of logic and culpability."
    },
    {
        type: PersonalityType.THE_PROVIDER,
        name: "The Provider",
        description: "ESFJs are the stereotypical extroverts. This personality type is effortlessly social, born of a need to interact with others. This desire to make others happy usually results in popularity for the ESFJ. The ESFJ often tends to be the cheerleader or sports hero in high school and college. Later in life, they continue to revel in the spotlight. ESFJs are primarily focused on organizing social events for their families, friends and communities. ESFJ is a common personality type and one that is liked by many people."
    },
    {
        type: PersonalityType.THE_IDEALIST,
        name: "The Idealist",
        description: "INFPs, like most introverts, are quiet and reserved. This personality type prefers not to talk about themselves, especially upon first meeting a new person. They prefer spending time alone in quiet places. This provides the opportunity for the INFP to make sense of the world around them. INFPs love analyzing signs and symbols, often considering them to be metaphors that have deeper meanings related to life. This personality type can become lost in their imagination and daydreams. This occasionally leads to the INFP drowning in the depth of their thoughts, fantasies, and ideas."
    },
    {
        type: PersonalityType.THE_PERFORMER,
        name: "The Performer",
        description: "TESFPs have an Extroverted, Observant, Feeling and Perceiving personality, and are commonly seen as Entertainers. Born to provide amusement and distraction to others and to hog the limelight, ESFPs love to hold court in a group. ESFPs are thoughtful explorers who enjoy learning – and sharing what they learn with others. ESFPs live for company, and typically have strong interpersonal skills. They are lively and fun, and will never decline the opportunity to be the center of attention. Despite this court jester-like demeanor however, ESFPs are warm, generous, and friendly. They are also typically sympathetic and concerned for the well-being of others."
    },
    {
        type: PersonalityType.THE_CHAMPION,
        name: "The Champion",
        description: "ENFPs have an Extroverted, Intuitive, Feeling and Perceiving personality. This personality type is highly individualistic. Champions are not followers, and care little for the status quo. Instead, they strive toward creating their own methods, looks, actions, habits, and ideas. ENFPs do not welcome cookie cutter people into their circle and loathe being forced to live inside a box. They do enjoy company though – assuming it is the “right” company – enjoying strong intuition when it comes to themselves and others. ENFPs operate from their feelings most of the time. This is no bad thing, as they are highly perceptive and thoughtful."
    },
    {
        type: PersonalityType.THE_DOER,
        name: "The Doer",
        description: "ESTPs have an Extroverted, Sensing, Thinking, and Perceptive personality. ESTPs live for social interaction, drawing power from feelings and emotions. This does not mean that ESTPs are flippant. They enjoy logical processes and reasoning, provided this does not stand in the way of freedom in thought and deed. Theory and abstracts will not retain the attention or interest of an ESTP for long. This personality type prefers to leap before they look, fixing mistakes as they go. This is preferable to sitting idle or preparing contingency plans."
    },
    {
        type: PersonalityType.THE_SUPERVISOR,
        name: "The Supervisor",
        description: "ESTJs place a great deal of emphasis on traditional values. These include organization, honesty, dedication and dignity. This personality type believe firmly in doing what they believe is right and socially acceptable. Though the paths towards “good” and “right” are difficult to define, an ESTJ will act as the leader of the pack and extol personal views. They are the epitome of good citizenry. People often look to ESTJs for guidance and counsel, and this personality type will always be happy to provide such assistance."
    },
    {
        type: PersonalityType.THE_COMMANDER,
        name: "The Commander",
        description: "An ENTJ's primary concern is focus is managing external circumstances with logic and discipline. Once this has been achieved, intuition and reasoning take effect. ENTJs are the most natural leaders among the 16 personality types. This personality type will always relish the opportunity to take charge. ENTJs live in a world of possibilities, often viewing challenges and obstacles great opportunities to push themselves. They have a natural gift for leadership and never shirk from making decisions. Options and ideas will be quickly yet carefully reviewed. ENTJs are “take charge” people who do not like to sit still and allow life to happen around them."
    },
    {
        type: PersonalityType.THE_THINKER,
        name: "The Thinker",
        description: "INTPs are highly regarded for brilliant theories and unrelenting logic. This makes sense, as this personality type is arguably the most logical of all. INTPs love patterns, have a keen eye for picking up on discrepancies, and possess the ability to read people. This makes it inadvisable to lie to an INTP. People of this personality type lack interest in practical, day-to-day activities and maintenance. When an INTP finds an environment that provides the opportunity to stretch their creative muscles, there is no limit to the time and energy expended. A sensible and unbiased solution becomes likely."
    },
    {
        type: PersonalityType.THE_NURTERER,
        name: "The Nurturer",
        description: "ISFJs are philanthropists. This personality type is always ready to give back, and any generosity received will be returned threefold. The people and things an ISFJ believes in will be upheld, and supported with enthusiasm and unselfishness. This makes this among the most warm and kind-hearted personality types. Harmony and cooperation are important to the ISFJ, and this type is likely to be sensitive to the feelings of others. The ISFJ is valued for their consideration and awareness, and often bring out the best in others."
    },
    {
        type: PersonalityType.THE_VISIONARY,
        name: "The Visionary",
        description: "The ENTP personality is among the rarest in the world, which is understandable. Although they are extroverts, ENTPs reject small talk – and may not thrive in social situations. This is especially true is the ENTP is surrounded by vastly different personality types. ENTPs are intelligent and knowledgeable, and as a result they need to be constantly mentally stimulated. This personality types relishes the opportunity to discuss theories and facts in extensive detail, needing little encouragement to set the world to rights. ENTPs are logical, rational and objective in their approach to information and arguments. They expect the same from a debating partner."
    },
    {
        type: PersonalityType.THE_COMPOSER,
        name: "The Composer",
        description: "ISFPs are introverts but may not always seem this way. Even if an ISFP has difficulties connecting to other people initially, they eventually grow warm, approachable, and friendly. ISFPs are fun to be around and very spontaneous. This makes them the perfect friend to tag along with an activity, planned or unplanned. ISFPs look to live life to the fullest and embrace the present. This ensures they are always keen to encounter a new experience or make a discovery. ISFPs find wisdom in understanding, so they find more value in meeting new people than other introverted personality types."
    }
]

export const getPersonalityByType = (type: PersonalityType) => {
    return personality_data.find((x)=>x.type === type)
}

export const changePersonality = async (type: PersonalityType) => {
    const res = await axios.put("/api/user/edit/personality", {type});
    return res.data as ApiResponse<{}>
}