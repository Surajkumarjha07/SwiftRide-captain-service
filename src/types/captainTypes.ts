
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

type deleteType = {
    captainEmail: string,
    password: string
}

type updateType = {
    newEmail?: string,
    newName?: string,
    newPassword?: string,
    newVehicleType?: string,
    newVehicleNo?: string,
    oldPassword: string,
    captainEmail: string
}

export type { signUpType, loginType, updateType, deleteType };