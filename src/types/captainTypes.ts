
type signUpType = {
    email: string,
    name: string,
    password: string,
    role: string,
    latitude?: number,
    longitude?: number
}

type loginType = {
    email: string,
    password: string
}

type updateType = {
    newEmail: string,
    newName: string,
    newPassword: string,
    newRole: string,
    oldPassword: string,
    email: string
}

export type { signUpType, loginType, updateType };