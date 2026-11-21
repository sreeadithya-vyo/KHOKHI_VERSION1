import { useSmoothScroll } from '@/lib/useSmoothScroll'
import { Hero } from '@/components/landing/Hero'
import { CityMarquee } from '@/components/landing/CityMarquee'
import { Statement } from '@/components/landing/Statement'
import { TrustStrip } from '@/components/landing/TrustStrip'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { Audiences } from '@/components/landing/Audiences'
import { ProblemSolution } from '@/components/landing/ProblemSolution'
import { Stats } from '@/components/landing/Stats'
import { FinalCta } from '@/components/landing/FinalCta'
import { Footer } from '@/components/layout/Footer'

export default function Landing() {
  useSmoothScroll()

  return (
    <>
      <Hero />
      <CityMarquee />
      <Statement />
      <TrustStrip />
      <HowItWorks />
      <Audiences />
      <ProblemSolution />
      <Stats />
      <FinalCta />
      <Footer />
    </>
  )
}
