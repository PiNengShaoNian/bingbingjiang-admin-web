export const storage = {
    get(key) {
        const result = window.localStorage.getItem(key)
        if (!result) return result
        else {
            const parsedResult = JSON.parse(result)
            const { expire, val } = parsedResult
            if (+expire > Date.now()) {
                console.log('valid')
                return val
            }
            else return null
        }
    },
    set(key, val, expire = 1024 * 7200) {
        const catchVal = {
            val,
            expire: Date.now() + expire
        }

        window.localStorage.setItem(key, JSON.stringify(catchVal))
        return catchVal
    },
    remove(key) {
        localStorage.removeItem(key)
    }
}