function getEnvironmentWithDefault(key: string, defaultValue: string) {
    return process.env[key] || defaultValue
}

function getEnvironmentWithoutDefault(key: string) {
    let res = process.env[key] || undefined
    if (res == undefined) {
        throw new Error(`Environment variable ${key} is not set`)
    }
    return res
}

export {getEnvironmentWithDefault, getEnvironmentWithoutDefault}