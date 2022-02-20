const isName = (name: string) => name?/^[a-zA-z]+$/i.test(name):true
export const isUserName = (name: string) => name?.length>2 && !(/[ `!@#$%^&*()+\-=\[\]{};':"\\|,<>\/?~]/.test(name))
export const isFullName = (full_name: string) => {
    const s = full_name.split(" ")
    const fn = s[0], ln = s[1] || ""
    return fn.length >= 3 && fn.length < 15 && ln.length < 15 && isName(fn) && isName(ln)
}
export const isDescription = (desc: string) => desc && desc.length>=10 && desc.length<301