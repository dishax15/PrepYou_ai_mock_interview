"use client";

import { interviewer } from '@/constants';
import { createFeedback } from '@/lib/actions/general.action';
import { cn } from '@/lib/utils';
import { vapi } from '@/lib/vapi.sdk';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';



enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage{
  role: 'user' | 'system' | 'assistant';
  content:string;
}


const Agent = ({ userName , userId , type , interviewId , questions, feedbackId} : AgentProps) => {
    const router = useRouter();
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
    const [messages, setMessages] = useState<SavedMessage[]>([]);
    // const [lastMessage, setLastMessage] = useState<string>("");


    useEffect(() => {
      const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
      const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
      
      const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };

        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => console.log("Error:", error);

    //Listeners
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
}, [])


const handleGenerateFeedback = async(messages : SavedMessage[]) => {
      console.log('Generate feedback here.');

   //generate response and destructure it
   // TODO:create a server action that geneates feedback
      const { success,feedbackId: id} = await createFeedback({
        interviewId:interviewId!,  
        userId:userId!,
        transcript:messages,
        feedbackId,
      });

      if(success && id){
        router.push(`/interview/${interviewId}/feedback`);
      }else{
        console.log('Error saving feedback');
        router.push('/');
      }
}


useEffect(() => {
        if(callStatus === CallStatus.FINISHED){
          if(type === 'generate'){
            router.push('/')
          }else{
            handleGenerateFeedback(messages);
          }
        }
}, [messages, callStatus, router, type, userId]);


const handleCall = async() => {
      setCallStatus(CallStatus.CONNECTING);

      if(type === "generate"){
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!,{
        variableValues:{
          username: userName,
          userid: userId,
        }
      })
    }else{
       let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }
      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
};


const handleDisconnect = async () => {
      setCallStatus(CallStatus.FINISHED);
      await vapi.stop();
  }

    const latestMessage = messages[messages.length-1]?.content;
    const isCallInactiveOrFinished = callStatus === CallStatus.INACTIVE || callStatus===CallStatus.FINISHED;

     
return (
    <>
        {/* {Interviewer card} */}
        <div className='call-view'>
        <div className='card-interviewer'>
            <div className="relative">
            {/* Layer 1: the cropped avatar circle */}
                <div className='avatar overflow-hidden rounded-full'>
                <Image src="/New_robo_prepview.png" alt="Interviewer"
                  width={200} height={200} className="object-cover rounded-full w-full h-full scale-125" />
                </div>

        {/* Layer 2: the speaking ring, sits OUTSIDE the clipped div */}
            {isSpeaking && (
            <span className="absolute -inset-3 rounded-full animate-ping bg-primary-200/40" />
                )}
            </div>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-primary-200 to-primary-100 flex items-center justify-center">
            <span className="text-5xl font-bold text-dark-100">
             {userName?.charAt(0).toUpperCase()}
            </span>
            </div>
            <h3>{userName}</h3>
          </div>
        </div>
    </div>


    {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={latestMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}


     <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute -inset-2 animate-ping rounded-full bg-primary-200/40 opacity-75",
                callStatus !== CallStatus.CONNECTING && "hidden"
              )}
            />

            <span className="relative">
              {isCallInactiveOrFinished ? "Call" : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  )
}

export default Agent