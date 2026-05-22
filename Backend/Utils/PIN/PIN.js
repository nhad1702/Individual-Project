import pin from 'node-pin'

export function PIN4Generator () {
    return pin.generator(4)
}

export function PIN6Generator () {
    return pin.generator(6)
}