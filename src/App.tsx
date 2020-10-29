import React, { useEffect, useState } from 'react'

import { AiOutlineLoading } from "react-icons/ai"
import { BiMicrophone } from "react-icons/bi"
import { useStoreState } from './state/hooks'
import { nonEmptyString } from './util/nonEmptyString'
import { VoiceHandler } from './util/VoiceHandler'

import { Slide, ToastContainer } from "react-toastify"
import { NotificationSystem } from './util/NotificationSystem'

const App = () => {

    useEffect(() => {
        VoiceHandler.initializeAudio()
        VoiceHandler.startListening()
        NotificationSystem.initialize()
    }, [])

    const loading = useStoreState(state => state.loading)
    const utterance = useStoreState(state => state.utterance)

    return <>

        <ToastContainer
            position="top-center"
            className="mt-24"
            style={{ zIndex: 5 }}
            toastClassName="px-6 py-2 text-xs bg-white rounded-full shadow-lg min-h-0 mb-2 mx-auto font-bold"
            transition={Slide}
            autoClose={2000}
            hideProgressBar={true}
            newestOnTop={false}
            closeButton={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover />
        
        <div className="flex flex-col absolute top-0 mt-16 w-full" style={{ zIndex: 10 }}>
            <div className="flex flex-row mx-auto items-center space-x-4 bg-white p-1 border rounded-full pr-6 shadow-lg">
                <div className="flex flex-row items-center justify-center w-8 h-8 bg-white shadow-lg border rounded-full">
                    { loading ? <AiOutlineLoading className="animate-spin" /> : <BiMicrophone size="1.1rem" /> }
                </div>
                <div className="flex flex-row" style={{ transition: "width 1s" }}>
                    { nonEmptyString(utterance.final) ? (
                        <span className="text-gray-900 font-bold">{ utterance.final }</span> 
                    ) : ( ( nonEmptyString(utterance.intermediate) || nonEmptyString(utterance.confirmed) ) ? (
                        <span className="text-gray-500 font-bold">{ utterance.confirmed } <span className="text-gray-200 font-normal">{ utterance.intermediate }</span></span>
                    ) : (
                        <span className="text-gray-500 font-bold">Start speaking...</span>
                    ) ) }
                </div>
            </div>
        </div>

    </>
}

export default App
