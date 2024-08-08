import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  useDisclosure,
} from '@chakra-ui/react'
import { List, SignOut } from 'phosphor-react'

import React from 'react'
import { tokenAtom } from '../../atoms'
import { useAtom } from 'jotai'
import { Link } from 'react-router-dom'

export function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()
  const [_, setToken] = useAtom(tokenAtom)
  

  return (
    <>
      <button
        ref={btnRef as any}
        className="absolute left-2 top-2 p-3 bg-gray-200 z-10 rounded-md"
        onClick={onOpen}
      >
        <List size={28} />
      </button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef as any}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <h1 className="font-2xl text-[#327D6B] font-bold">
              Seus flows de menu
            </h1>
            <DrawerCloseButton className="my-2" />
          </DrawerHeader>

          <DrawerBody>
            <Link to="/chat" className="block my-2 bg-[#327D6B] p-2 text-white font-bold rounded-md">
              Chat
            </Link>
          </DrawerBody>

          <DrawerFooter className="flex gap-3 w-full justify-between">
            <button
              className="flex justify-between bg-red-500 text-white px-4 py-2 font-bold rounded-md"
              onClick={() => setToken('')}
            >
              <SignOut size={24} />
              <p className="ml-2">Sair</p>
            </button>
            <button
              className="bg-[#327D6B] text-white px-4 py-2 font-bold rounded-md"
              onClick={onClose}
            >
              Cancelar
            </button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}
