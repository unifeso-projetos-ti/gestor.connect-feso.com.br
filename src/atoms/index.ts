import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { MenuRequest, OptionRequest } from 'src/@types/menu'

export const createOptionDataMenuAtom = atom({} as any)

export const refreshFlowAtom = atom(false)

export const tokenAtom = atomWithStorage('token', '')

export const isLoginAtom = atom((get) => !!get(tokenAtom))

export const selectedMenuAtom = atom({} as MenuRequest)

export const selectedOptionAtom = atom({} as OptionRequest)