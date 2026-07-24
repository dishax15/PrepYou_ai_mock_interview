import InterviewCard from '@/components/InterviewCard'
import { Button } from '@/components/ui/button'
import { getCurrentUser} from '@/lib/actions/auth.action'
import { getInterviewsByUserId, getLatestInterviews } from '@/lib/actions/general.action'
import Image from 'next/image'
import Link from 'next/link'

const Home = async () => {
  const user = await getCurrentUser();
  console.log(user);//  

  const [userInterviews, allInterviews]=await Promise.all([
     getInterviewsByUserId(user?.id!),
     getLatestInterviews({ userId:user?.id! })
  ]);
   console.log(user);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpComingInterviews = allInterviews?.length! > 0;

  return (
      <>
        <section className='card-cta'>
            <div className='flex flex-col gap-8 max-w-lg'>
              <h2>Get Interview-Ready with AI-powered Practice & Feedback</h2>
                <p className='text-lg'>Practice on real interview questions & get instant feedback</p>
                  <Button asChild className='btn-primary max-sm:w-full'>
                    <Link href="/interview"> Start an Interview</Link>
                  </Button>
            </div>
            <Image
              src="/Robo_prepview.png"
              alt="Ai-robot"
              width={500} 
              height={500}
              className='max-sm:hidden'/>
        </section>

        <section className='flex flex-col gap-6 mt-8'>
            <h2>Your Interviews</h2>
            <div className="interviews-section">
              {hasPastInterviews ? (
                    userInterviews?.map((interview) => (
                   <InterviewCard {... interview} 
                      key={interview.id}
                      userId={user?.id} />
                    ))
                  ):(
                    <p>You haven&apos;t taken any interview yet</p>
                  )
              }
            </div>
        </section>

        <section className='flex flex-col gap-6 mt-8'>
          <h2>Take an interview</h2>
          <div className='interviews-section'>
          {hasUpComingInterviews ? (
                    allInterviews?.map((interview) => (
                      <InterviewCard {... interview} 
                      key={interview.id}
                      userId={user?.id} />
                    ))
                  ):(
                    <p>There are no new interview available</p>
                  )
              }
          </div>
        </section>
    </>
  )
}

export default Home;