type signUpType = {
    email: string,
    name: string,
    password: string,
    role: string,
    location: string
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