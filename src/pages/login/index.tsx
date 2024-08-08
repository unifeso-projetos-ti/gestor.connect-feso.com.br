import { api } from '../../api'
import logo from './imgs/logo-connectFeso.png'
import { tokenAtom } from '../../atoms'
import { useAtom } from 'jotai'
import { useToast } from '@chakra-ui/react'

export const Login = () => {
  const [_, setToken] = useAtom(tokenAtom)
  const toast = useToast()

  const submit = async (e: any) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/login', {
        email: e.target.email.value,
        password: e.target.password.value,
      })
      setToken(data.token)
    } catch (error) {
      toast({
        title: 'Erro ao fazer login',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }
  return (
    <main className="w-full h-screen flex justify-center items-center bg-[#327D6B] lg:w-[100%]">
      <section className="shadow-[0px_0px_30px_1px_#000] w-[65%] h-[80%] 
      flex justify-between items-center border-1 border-zinc-400 lg:h-[90%] lg:flex lg:flex-col lg:flex-row lg:justify-between lg:items-center lg:border-1 lg:border-zinc-400 2sm:w-[90%] 2sm:h-[95%]">
        <div className="w-full ps-8[50px] w-1/2 bg-gradient-to-r from-emerald-800 to-black flex justify-center h-full items-center lg:h-[30%]">
          <div className="w-full h-full lg:h-[20rem] lg:w-[20rem] flex justify-center align-center items-center ">
            <img src={logo} alt="Logo ConnectFeso"/>
          </div>
        </div>
        <div className="w-full h-full w-1/2 px-20 gap-2 flex-col flex justify-center  bg-white sm:px-10">
          <h1 className="w-full text-5xl text-2xl font-bold mb-2 border-b-1 border-zinc-400 pb-2 text-emerald-600 font-bold justify-center">
            Login
          </h1>
          <p className="w-full text-start text-sm mb-2 text-base">
            Bem-vindo de volta! Insira seu login para entrar em sua conta.
          </p>
          <form onSubmit={submit} className="flex flex-col w-full  gap-8 items-center pt-10 lg:gap-3 2sm:pt-2">
            <div className="flex w-full flex-col mb-2 gap-2">
              <label htmlFor="">E-mail</label>
              <input
                name="email"
                className=" border-1 m focus:outline-none  focus:ring-emerald-600 border-[1px] border-zinc-400 w-full h-[3rem] px-2 rounded-full font-regular"
                type="text"
              />
            </div>
            <div className="flex flex-col w-full gap-2">
              <label htmlFor="">Senha</label>
              <input
                name="password"
                className="border-1 focus:outline-none  focus:ring-emerald-600 border-[1px] border-zinc-400 w-full h-[3rem] px-2 rounded-full"
                type="password"
              />
            </div>
            <p>
              <a href="#" className="text-emerald-600">
                Esqueceu a senha?
              </a>
            </p>
            <button
              type="submit"
              className="w-[20rem] h-[3rem] bg-emerald-600 text-white text-lg font-semibold rounded-full bg-gradient-to-r from-slate-700 via-emerald-600 to-emerald-600 hover:via-teal-300 md:w-[15rem] 2sm:w-[10rem]">
              Entrar
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}