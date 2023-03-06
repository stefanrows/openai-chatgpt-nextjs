import React, { useRef } from "react"

// Types
interface Conversation {
  role: string
  content: string
}

export default function Home() {
  // States
  const [value, setValue] = React.useState<string>("")
  const [conversation, setConversation] = React.useState<Conversation[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleInput = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value)
    },
    []
  )

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const chatHistory = [...conversation, { role: "user", content: value }]
      const response = await fetch("/api/openAIChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: chatHistory }),
      })

      const data = await response.json()
      setValue("")
      setConversation([
        ...chatHistory,
        { role: "assistant", content: data.result.choices[0].message.content },
      ])
    }
  }

  const handleRefresh = () => {
    inputRef.current?.focus()
    setValue("")
    setConversation([])
  }

  return (
    <div className='w-full'>
      <div className='flex flex-col items-center justify-center w-2/3 mx-auto mt-40 text-center'>
        <h1 className='text-6xl'>Hi there, I am AVA</h1>
        <div className='my-12'>
          <p className='mb-6 font-bold'>Please type your prompt</p>
          <input
            placeholder='Type here'
            className='w-full max-w-xs input input-bordered input-secondary'
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
          />
          <button
            className='mt-6 btn btn-primary btn-xs'
            onClick={handleRefresh}
          >
            Start New Conversation
          </button>
        </div>
        <div className='textarea'>
          {conversation.map((item, index) => (
            <React.Fragment key={index}>
              <br />
              {item.role === "assistant" ? (
                <div className='chat chat-end'>
                  <div className='chat-bubble chat-bubble-secondary'>
                    <strong className='badge badge-primary'>AVA</strong>
                    <br />
                    {item.content}
                  </div>
                </div>
              ) : (
                <div className='chat chat-start'>
                  <div className='chat-bubble chat-bubble-primary'>
                    <strong className='badge badge-secondary'>User</strong>
                    <br />
                    {item.content}
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
