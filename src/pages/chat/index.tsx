import { useEffect, useRef, useState } from "react"
import { api } from "../../api"
import { Avatar, useToast } from "@chakra-ui/react"
import { AxiosResponse } from "axios"
import { format } from "date-fns"
import { Link } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import { useAtom } from "jotai"
import { tokenAtom } from "../../atoms"
import { PaperPlaneRight, XCircle } from "phosphor-react"; 
import foto from "../../assets/foto_certa.png"
import arthur from "../../assets/wallpaper.jpeg"

type Message = {
  id_message: string
  id_call: string
  author: string
  message: string
  createdAt: string
  updatedAt: string
}

type Call = {
  message: Message[]
  in_support: boolean
}

type Client = {
  id_user: string
  name: string
  phone: string
  in_support: boolean
  messages: Message[]
}

type ClientResponse = {
  id_user: string
  name: string
  phone: string
  call: Call[]
}

export const Chat = () => {
  const [clients, setClients] = useState([] as Client[])
  const [selectedClient, setSelectedClient] = useState({} as Client)
  const [token] = useAtom(tokenAtom)
  const user: any = jwtDecode(token)
  const [message, setMessage] = useState('')
  const toast = useToast()
  const refScroll = useRef<any>(null)
  
  const getClient = async () => {
    try {
      
      const { data }: AxiosResponse<ClientResponse[]> = await api.get('/user')
      const reducerClients = data.map((item) => {
        return {
          id_user: item.id_user,
          name: item.name,
          phone: item.phone,
          in_support: item.call.some((call) => call.in_support),
          messages: item.call.reduce((acc, call) => {
            return [...acc, ...call.message]
          }, [] as Message[])
        }

      })
      setClients(reducerClients)

      if (selectedClient.id_user) {
      
      }
 
    } catch (error) {
      toast({ title: 'Error', description: 'Error to get clients', status: 'error', duration: 9000, isClosable: true })

    }
  }

  const syncClient = async (reducerClients:Client[]) => {
    if(!selectedClient?.id_user) return
    const client = reducerClients.find((item) => item.id_user === selectedClient.id_user)!

    setSelectedClient({
      id_user: client.id_user,
      name: client.name,
      phone: client.phone,
      in_support: client.in_support,
      messages: client.messages
    
    })

    if (selectedClient.messages.length !== client.messages.length) {
      window.scrollTo({
        behavior: 'smooth',
        top: refScroll.current.scrollHeight
       })
    }
  }


  const formatMessage = (message: string) => {
    return message.replace(/(?:\r\n|\r|\n)/g, '<br>').replace(/(?:\t)/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
  }

const sendMessage = async (e: any) => {
  e.preventDefault()
  try { 
    
    if (!message) return
    await api.post('/support/send', {
      to: selectedClient.phone,
      message,
      name_user:"Suporte 1",
      id_call: selectedClient.messages[selectedClient.messages.length - 1].id_call,
      author: 'employee'
    })
    setMessage('')
    window.scrollTo({
      behavior: 'smooth',
      top: refScroll.current.scrollHeight
     })
  } catch (error) {
    console.log({error});
    
    toast({ title: 'Error', description: 'Error to send message', status: 'error', duration: 9000, isClosable: true })
  }
}

  const closeChat = async () => {
  try {
    await api.post('/support/closeCall', {
      phone: selectedClient.phone,
      id_call: selectedClient.messages[selectedClient.messages.length - 1].id_call,
    })
    setSelectedClient({} as Client)
  } catch (error) {
    toast({ title: 'Error', description: 'Error to close chat', status: 'error', duration: 9000, isClosable: true })
  }
  }

  useEffect(() => {
    let time = null
    if(time) clearInterval(time)
    time = setInterval(() => {
        getClient()
      }, 1000)

    }, [])
    

    useEffect(() => {
      syncClient(clients)
    } , [clients])


 

  return (
    <main
      className="flex w-full h-screen bg-gray-100"
    >
      <section
        className="w-1/4 h-full bg-white overflow-auto  fixed"
      >
        <header
          className="flex items-center justify-between w-full h-20 px-4 border-b"
        >
          <div
            className="text-lg font-semibold"
          >
            Chat
          </div>
          <div
            className="flex items-center"
          >
            <Avatar size="md" name={user.name}
            backgroundColor={'#327D6B'}
            />
            <div
              className="ml-2"
            >
              <div
                className="text-sm font-semibold"
              >
                {user.name}
              </div>
              <div
                className="text-xs text-gray-500"
              >
                Status
              </div>
            </div>
          </div>
        </header>
        {

          clients.filter(filter => filter.in_support).map((item) => (
            <div
              key={item.id_user}
              onClick={() => {
                setSelectedClient(item)
              }}
              className="flex items-center justify-between w-full h-20 px-4 border-b hover:bg-gray-100 cursor-pointer"
            >
              <div
                className="flex items-center"
              >
               <Avatar size="md" name={item.name} />
                <div
                  className="ml-2"
                >
                  <div
                    className="text-lg font-semibold"
                  >
                    {item.name}
                  </div>
                  <div
                    className="text-sm text-gray-500"
                  >
                    {item.messages[item.messages.length - 1].message.length > 20 ? item.messages[item.messages.length - 1].message.slice(0, 20) + '...' : item.messages[item.messages.length - 1].message}
                  </div>
                </div>
              </div>
              <div
                className="text-sm text-gray-500"
              >
                {format(new Date(item.messages[item.messages.length - 1].createdAt), 'dd/MM/yyyy')}
              </div>
            </div>
          ))
        }
        <footer
        className="p-2 w-full bg-white fixed bottom-0"
         >

        <Link to="/" className=" absolute bottom-0 my-2 bg-[#327D6B] p-2 text-white font-bold rounded-md">
              Voltar
        </Link>
        </footer>
      </section>
      <section
        className="w-3/4 h-full bg-gray-100 absolute right-0"
      >
        {selectedClient.name ? (
          <>
        <header
          className="flex items-center justify-between w-full h-20 px-4 border-b fixed bg-white"
          >
          <div
            className="flex items-center"
          >
            <Avatar size="md" name={selectedClient.name} />
            <div
              className="ml-2"
              >
              <div
                className="text-lg font-semibold"
                >
                {selectedClient.name}
              </div>
              <div
                className="text-sm text-gray-500"
              >
                {selectedClient.phone}
              </div>
            </div>
          </div>
          <div
            className="text-sm text-gray-500"
            >

          </div>
        </header>
        <div
          className="w-full bg-no-repeat bg-cover bg-center h-full overflow-auto"
          style={{
            backgroundImage: `url(${arthur})`,      
          }}
        >
          <div
            className="w-full overflow-auto"
            >
               
            <div
              ref={refScroll}
              className="w-full "
              >
              {
                selectedClient.messages.map((item) => (
                  <div
                  key={item.id_message}
                  className={`w-full px-4 py-2 my-24 flex ${item.author !== 'user' ? 'justify-end ' : 'justify-start'} m-3  rounded`}
                  >
                  
                    <div
                      className={`
                        w-64 flex-col flex shadow-md  rounded-sm p-2 ${item.author !== 'user' ? 'bg-green-900 text-right' : 'bg-white text-left'}`}
                        >
                      <p
                        className={`text-sm ${item.author !== 'user' ? ' text-white' : ' text-gray-500'}
                          font-semibold
                        `}
                      >
                        {item.author !== 'user' ?  user.name : selectedClient.name}
                      </p>
                      <div
                        className="text-lg font-semibold"
                        >
                        <div
                          className={`text-sm m-3 ${item.author !== 'user' ? ' text-white' : ' text-gray-900'}`}
                          dangerouslySetInnerHTML={{ __html: formatMessage(item.message) }} />
                      </div>
                      <p
                        className={`text-sm ${item.author !== 'user' ? ' text-white' : ' text-gray-500'}`}
                        >
                        {format(new Date(item.createdAt), 'dd/MM/yyyy HH:mm:ss')}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
            </div>

            {selectedClient.in_support && (
              <footer
              className="w-3/4 bg-white fixed bottom-0"
              >
                <form
                onSubmit={sendMessage}
                className="flex items-center justify-between w-full h-20 px-4 border-t"
                >
                  <button
                  type="button"
                  onClick={closeChat}
                  className="px-4 py-2 m-2 text-white bg-red-500 rounded"
                  >
                   <XCircle size={32} />
                  </button>
                  <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  type="text"
                  placeholder="Type a message"
                  className="w-full h-12 px-4 border rounded"
                  />
                  <button
                  
                  className="px-4 py-2 m-2 flex justify-center items-center text-white bg-blue-500 rounded"
                  >
                    <p
                     className="p-2"
                    >

                    Send
                    </p>
                    <PaperPlaneRight size={16} />
                  </button>
                </form>
              </footer>
            )
            
          }
          </div>
          </>
        ) : (
          <div
            className="flex items-center justify-center w-full h-full"
          >

            <p>
              Selecione um cliente para iniciar a conversa
            </p>
          </div>

        )}

      </section>
    </main>
  )
}